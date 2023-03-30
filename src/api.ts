import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { useBatchCrawlHandleByMode } from './batchCrawlHandle'
import { request } from './request'
import { quickSort } from './sort'
import {
  isArray,
  isString,
  isUndefined,
  log,
  logError,
  logNumber,
  logSuccess,
  logWarn
} from './utils'

import {
  Cookies,
  CrawlBaseConfigV1,
  CrawlDataConfig,
  CrawlFileConfig,
  CrawlPage,
  CrawlPageConfig,
  CrawlResCommonArrV1,
  CrawlResCommonV1,
  FileInfo,
  MergeConfigRawConfig,
  MergeConfigV1,
  MergeConfigV2,
  StartPollingConfig
} from './types/api'
import { LoaderXCrawlBaseConfig } from './types'

function mergeConfig<R, T extends MergeConfigRawConfig = MergeConfigRawConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): R {
  const newConfig = structuredClone(rawConfig)

  // 1.处理 requestConfig
  const rawRequestConfigArr = isArray(newConfig.requestConfig)
    ? newConfig.requestConfig
    : [newConfig.requestConfig]
  newConfig.requestConfig = rawRequestConfigArr.map((item) => {
    const requestItem = isString(item) ? { url: item } : item
    const { url, timeout, proxy } = requestItem

    // 1.1.baseUrl
    if (!isUndefined(baseConfig.baseUrl)) {
      requestItem.url = baseConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout)) {
      requestItem.timeout = baseConfig.timeout
    }

    // 1.3.porxy
    if (isUndefined(proxy)) {
      requestItem.proxy = baseConfig.proxy
    }

    return requestItem
  })

  // 2.处理 intervalTime
  if (isUndefined(newConfig.intervalTime)) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig as any as R
}

function parseCrawlPageCookies(
  url: string,
  cookies: Cookies
): Protocol.Network.CookieParam[] {
  const cookiesArr: Protocol.Network.CookieParam[] = []

  if (typeof cookies === 'string') {
    cookies.split('; ').forEach((item) => {
      const cookie = item.split('=')
      cookiesArr.push({ name: cookie[0], value: cookie[1], url })
    })
  } else if (Array.isArray(cookies)) {
    cookies.forEach((cookie) => {
      if (!cookie.url) {
        cookie.url = url
      }

      cookiesArr.push(cookie)
    })
  } else if (typeof cookies === 'object' && cookies) {
    if (!cookies.url) {
      cookies.url = url
    }

    cookiesArr.push(cookies)
  }

  return cookiesArr
}

export function createCrawlPage(baseConfig: LoaderXCrawlBaseConfig) {
  let browser: Browser | null = null
  let createBrowserPending: Promise<void> | null = null
  let haveCreateBrowser = false

  async function crawlPage<T extends CrawlPageConfig = CrawlPageConfig>(
    config: T,
    callback?: (res: CrawlPage) => void
  ): Promise<
    T extends string[] | CrawlBaseConfigV1[] ? CrawlPage[] : CrawlPage
  > {
    // 创建浏览器
    if (!haveCreateBrowser) {
      haveCreateBrowser = true
      createBrowserPending = puppeteer.launch().then((res) => {
        browser = res
      })
    }

    // 等待浏览器创建完毕
    if (createBrowserPending) {
      await createBrowserPending
      // 防止对 createBrowserPending 重复赋值
      if (createBrowserPending) createBrowserPending = null
    }

    // 合并 baseConfig 配置
    const { requestConfig, intervalTime } = mergeConfig<MergeConfigV1>(
      baseConfig,
      {
        requestConfig: config
      }
    )

    const container: CrawlPage[] = []
    await useBatchCrawlHandleByMode(
      'page',
      baseConfig.mode,
      requestConfig,
      intervalTime,
      crawlPageHandle,
      (handleResItem) => {
        if (callback) {
          callback(handleResItem)
        }

        container.push(handleResItem)
      }
    )

    const res = isArray(config)
      ? quickSort(
          container.map((item) => ({ ...item, valueOf: () => item.id }))
        )
      : container[0]

    return res as T extends string[] | CrawlBaseConfigV1[]
      ? CrawlPage[]
      : CrawlPage
  }

  async function crawlPageHandle(handleConfig: CrawlBaseConfigV1) {
    let page: Page | null = null
    let httpResponse: HTTPResponse | null = null

    try {
      page = await browser!.newPage()
      await page.setViewport({ width: 1280, height: 1024 })

      if (handleConfig.proxy) {
        await browser!.createIncognitoBrowserContext({
          proxyServer: handleConfig.proxy
        })
      } else {
        await browser!.createIncognitoBrowserContext({
          proxyServer: undefined
        })
      }

      if (handleConfig.headers) {
        await page.setExtraHTTPHeaders(
          handleConfig.headers as any as Record<string, string>
        )
      }

      if (handleConfig.cookies) {
        await page.setCookie(
          ...parseCrawlPageCookies(handleConfig.url, handleConfig.cookies)
        )
      }

      httpResponse = await page.goto(handleConfig.url, {
        timeout: handleConfig.timeout
      })
    } catch (error) {
      await page?.close()
      throw error
    }

    return { httpResponse, browser: browser!, page }
  }

  return crawlPage
}

export function createCrawlData(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlData<T = any>(
    config: CrawlDataConfig,
    callback?: (res: CrawlResCommonV1<T>) => void
  ): Promise<CrawlResCommonArrV1<T>> {
    const { requestConfig, intervalTime } = mergeConfig<
      MergeConfigV2<CrawlDataConfig>
    >(baseConfig, config)

    const container: CrawlResCommonArrV1<T> = []
    await useBatchCrawlHandleByMode(
      'data',
      baseConfig.mode,
      requestConfig,
      intervalTime,
      request,
      (handleResItem) => {
        const contentType = handleResItem.headers['content-type'] ?? ''
        const rawData = handleResItem.data

        const data = contentType.includes('text')
          ? rawData.toString()
          : JSON.parse(rawData.toString())

        const itemRes = { ...handleResItem, data }

        if (callback) {
          callback(itemRes)
        }

        container.push(itemRes)
      }
    )

    const res = quickSort(
      container.map((item) => ({ ...item, valueOf: () => item.id }))
    )
    return res
  }

  return crawlData
}

export function createCrawlFile(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlFile(
    config: CrawlFileConfig,
    callback?: (res: CrawlResCommonV1<FileInfo>) => void
  ): Promise<CrawlResCommonArrV1<FileInfo>> {
    const { requestConfig, intervalTime, fileConfig } = mergeConfig<
      MergeConfigV2<CrawlFileConfig>
    >(baseConfig, config)
    if (!fs.existsSync(fileConfig.storeDir)) {
      fs.mkdirSync(fileConfig.storeDir)
    }

    const container: CrawlResCommonArrV1<FileInfo> = []
    const saveFileArr: Promise<void>[] = []
    const saveFileErrorArr: { message: string; valueOf: () => number }[] = []
    await useBatchCrawlHandleByMode(
      'file',
      baseConfig.mode,
      requestConfig,
      intervalTime,
      request,
      (handleResItem) => {
        const { id, headers, data } = handleResItem

        const mimeType = headers['content-type'] ?? ''
        const fileExtension = fileConfig.extension ?? mimeType.split('/').pop()
        const fileName = new Date().getTime().toString()
        const filePath = path.resolve(
          fileConfig.storeDir,
          `${fileName}.${fileExtension}`
        )

        const saveFiletem = writeFile(filePath, data)
          .catch((err) => {
            const message = `File save error at id ${id}: ${err.message}`
            const valueOf = () => id

            saveFileErrorArr.push({ message, valueOf })

            return true
          })
          .then((isError) => {
            if (isError) return

            const res = {
              ...handleResItem,
              data: { fileName, mimeType, size: data.length, filePath }
            }

            if (callback) {
              callback(res)
            }

            container.push(res)
          })

        saveFileArr.push(saveFiletem)
      }
    )

    // 等待保存文件任务完成
    await Promise.all(saveFileArr)

    // 打印保存文件的错误
    quickSort(saveFileErrorArr).forEach((item) => log(logError(item.message)))

    const saveFileTotal = isArray(requestConfig) ? requestConfig.length : 1
    const success = container.length
    const error = saveFileTotal - success
    log(
      `Total saved files: ${logNumber(saveFileTotal)}, success: ${logSuccess(
        success
      )}, error: ${logError(error)}`
    )

    // 排序结果
    const res = quickSort(
      container.map((item) => ({ ...item, valueOf: () => item.id }))
    )

    return res
  }

  return crawlFile
}

export function startPolling(
  config: StartPollingConfig,
  callback: (count: number, stopPolling: () => void) => void
) {
  const { d, h, m } = config

  const day = !isUndefined(d) ? d * 1000 * 60 * 60 * 24 : 0
  const hour = !isUndefined(h) ? h * 1000 * 60 * 60 : 0
  const minute = !isUndefined(m) ? m * 1000 * 60 : 0
  const total = day + hour + minute

  let count = 0

  startCallback()
  const intervalId = setInterval(startCallback, total)

  function startCallback() {
    console.log(logSuccess(`Start the ${logWarn.bold(++count)} polling`))

    callback(count, stopPolling)
  }

  function stopPolling() {
    clearInterval(intervalId)
    console.log(logSuccess(`Stop the polling`))
  }
}
