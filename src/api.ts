import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, Page, Protocol } from 'puppeteer'

import { LoaderConfig, controller } from './controller'
import { request } from './request'
import {
  isArray,
  isObject,
  isString,
  isUndefined,
  logSuccess,
  logWarn
} from './utils'

import {
  CrawlDataConfig,
  CrawlFileConfig,
  CrawlPageRes,
  CrawlPageConfig,
  CrawlRequestCommonRes,
  FileInfo,
  StartPollingConfig,
  CrawlRequestCommonConfig,
  MergeCrawlRequestConfig,
  RequestPageCookies,
  MergeCrawlPageConfig,
  RequestPageConfig,
  CrawlPageConfigObject
} from './types/api'
import { LoaderXCrawlBaseConfig } from './types'
import { RequestConfig } from './types/request'

function transformMergePageRequestConfig(
  config: string | string[] | RequestConfig | RequestConfig[]
): RequestPageConfig[] {
  return isArray(config)
    ? config.map((item) => (isObject(item) ? item : { url: item }))
    : [isObject(config) ? config : { url: config }]
}

function mergePageConfig<T extends CrawlPageConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): MergeCrawlPageConfig {
  const newConfig: MergeCrawlPageConfig = { requestConfig: [] }

  // 1.处理 requestConfig
  // 统一转成 RequestPageConfig 类型
  const rawRequestConfigArr: RequestPageConfig[] = []
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'requestConfig')) {
    // CrawlPageConfigObject 处理

    const { requestConfig, cookies, intervalTime, maxRetry } =
      rawConfig as CrawlPageConfigObject

    // 给 newConfig 进行赋值
    newConfig.cookies = cookies
    newConfig.intervalTime = intervalTime
    newConfig.maxRetry = maxRetry

    const transformRes = transformMergePageRequestConfig(requestConfig)

    rawRequestConfigArr.push(...transformRes)
  } else {
    // string | string[] | RequestPageConfig | RequestPageConfig[] 处理

    const transformRes = transformMergePageRequestConfig(
      rawConfig as string | string[] | RequestConfig | RequestConfig[]
    )

    rawRequestConfigArr.push(...transformRes)
  }

  newConfig.requestConfig = rawRequestConfigArr.map((item) => {
    const { url, timeout, proxy, maxRetry, cookies } = item

    // 1.1.baseUrl
    if (!isUndefined(baseConfig.baseUrl)) {
      item.url = baseConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout) && !isUndefined(baseConfig.timeout)) {
      item.timeout = baseConfig.timeout
    }

    // 1.3.porxy
    if (isUndefined(proxy) && !isUndefined(baseConfig.proxy)) {
      item.proxy = baseConfig.proxy
    }

    // 1.4.maxRetry
    // item > API Config > baseConfig
    if (isUndefined(maxRetry)) {
      if (!isUndefined(newConfig.maxRetry)) {
        // 取 API Config
        item.maxRetry = newConfig.maxRetry
      } else {
        // 取 baseConfig
        item.maxRetry = baseConfig.maxRetry
      }
    }

    // 1.5.cookies
    if (isUndefined(cookies) && !isUndefined(newConfig.cookies)) {
      // 取 API Config
      item.cookies = newConfig.cookies
    }

    return item
  })

  // 2.处理 intervalTime
  if (isUndefined(newConfig.intervalTime)) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig
}

function mergeRequestConfig<T extends CrawlRequestCommonConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): MergeCrawlRequestConfig<T> {
  const newConfig = structuredClone(rawConfig)

  // 1.处理 requestConfig
  const rawRequestConfigArr = isArray(newConfig.requestConfig)
    ? newConfig.requestConfig
    : [newConfig.requestConfig]
  newConfig.requestConfig = rawRequestConfigArr.map((item) => {
    const requestItem = isString(item) ? { url: item } : item
    const { url, timeout, proxy, maxRetry } = requestItem

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

    // 1.4.maxRetry
    // item > API Config > baseConfig
    if (isUndefined(maxRetry)) {
      if (!isUndefined(newConfig.maxRetry)) {
        // 取 API Config
        requestItem.maxRetry = newConfig.maxRetry
      } else {
        // 取 baseConfig
        requestItem.maxRetry = baseConfig.maxRetry
      }
    }

    return requestItem
  })

  // 2.处理 intervalTime
  if (isUndefined(newConfig.intervalTime)) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig as any as MergeCrawlRequestConfig<T>
}

async function crawlRequestSingle(
  loaderConfig: LoaderConfig<RequestConfig, any>
) {
  const { requestConfig } = loaderConfig

  return await request(requestConfig)
}

function parseCrawlPageCookies(
  url: string,
  cookies: RequestPageCookies
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
  const pages: { id: number; page: Page }[] = []

  async function crawlPage<T extends CrawlPageConfig>(
    config: T,
    callback?: (res: CrawlPageRes) => void
  ): Promise<T extends any[] ? CrawlPageRes[] : CrawlPageRes> {
    //  创建浏览器
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
    const { requestConfig: requestConfigs, intervalTime } = mergePageConfig(
      baseConfig,
      config
    )

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      crawlPageSingle
    )

    const crawlResArr: CrawlPageRes[] = controllerRes.map((item) => {
      const { id, isSuccess, maxRetry, retryCount, errorQueue, res } = item

      const crawlRes: CrawlPageRes = {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        data: null as any
      }

      if (isSuccess && res) {
        crawlRes.data = { browser: browser!, ...res }
      } else {
        const page = pages.filter((item) => item.id === id)[0].page
        crawlRes.data = { browser: browser!, response: null, page }
      }

      if (callback) {
        callback(crawlRes)
      }

      return crawlRes
    })

    const res = isArray(config) ? crawlResArr : crawlResArr[0]

    return res as T extends any[] ? CrawlPageRes[] : CrawlPageRes
  }

  async function crawlPageSingle(
    loaderConfig: LoaderConfig<RequestPageConfig, any>
  ) {
    const { id, requestConfig } = loaderConfig

    const page = await browser!.newPage()
    await page.setViewport({ width: 1280, height: 1024 })

    if (requestConfig.proxy) {
      await browser!.createIncognitoBrowserContext({
        proxyServer: requestConfig.proxy
      })
    } else {
      await browser!.createIncognitoBrowserContext({
        proxyServer: undefined
      })
    }

    if (requestConfig.headers) {
      await page.setExtraHTTPHeaders(
        requestConfig.headers as any as Record<string, string>
      )
    }

    if (requestConfig.cookies) {
      await page.setCookie(
        ...parseCrawlPageCookies(requestConfig.url, requestConfig.cookies)
      )
    }

    let response = null
    try {
      response = await page.goto(requestConfig.url, {
        timeout: requestConfig.timeout
      })
    } catch (error) {
      pages.push({ id, page })
    }

    return { response, page }
  }

  return crawlPage
}

export function createCrawlData(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlData<T = any>(
    config: CrawlDataConfig,
    callback?: (res: CrawlRequestCommonRes<T>) => void
  ): Promise<CrawlRequestCommonRes<T>[]> {
    const { requestConfig: requestConfigs, intervalTime } = mergeRequestConfig(
      baseConfig,
      config
    )

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      crawlRequestSingle
    )

    const crawlResArr: CrawlRequestCommonRes<T>[] = controllerRes.map(
      (item) => {
        const { id, isSuccess, maxRetry, retryCount, errorQueue, res } = item

        const crawlRes: CrawlRequestCommonRes<T> = {
          id,
          isSuccess,
          maxRetry,
          retryCount,
          errorQueue,
          data: null
        }

        if (isSuccess && res) {
          const contentType = res.headers['content-type'] ?? ''

          const data: T = contentType.includes('text')
            ? res.toString()
            : JSON.parse(res.toString())

          crawlRes.data = { ...res, data }
        }

        if (callback) {
          callback(crawlRes)
        }

        return crawlRes
      }
    )

    return crawlResArr
  }

  return crawlData
}

export function createCrawlFile(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlFile(
    config: CrawlFileConfig,
    callback?: (res: CrawlRequestCommonRes<FileInfo>) => void
  ): Promise<CrawlRequestCommonRes<FileInfo>[]> {
    const {
      requestConfig: requestConfigs,
      intervalTime,
      fileConfig
    } = mergeRequestConfig(baseConfig, config)

    if (!fs.existsSync(fileConfig.storeDir)) {
      fs.mkdirSync(fileConfig.storeDir)
    }

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      crawlRequestSingle
    )

    const saveFileArr: Promise<void>[] = []
    const saveFileErrorArr: { message: string; valueOf: () => number }[] = []

    const crawlResArr: CrawlRequestCommonRes<FileInfo>[] = controllerRes.map(
      (item) => {
        const { id, isSuccess, maxRetry, retryCount, errorQueue, res } = item

        const crawlRes: CrawlRequestCommonRes<FileInfo> = {
          id,
          isSuccess,
          maxRetry,
          retryCount,
          errorQueue,
          data: null
        }

        if (isSuccess && res) {
          const mimeType = res.headers['content-type'] ?? ''
          const fileExtension =
            fileConfig.extension ?? mimeType.split('/').pop()
          const fileName = new Date().getTime().toString()
          const filePath = path.resolve(
            fileConfig.storeDir,
            `${fileName}.${fileExtension}`
          )

          const saveFiletem = writeFile(filePath, res.data)
            .catch((err) => {
              const message = `File save error at id ${id}: ${err.message}`
              const valueOf = () => id

              saveFileErrorArr.push({ message, valueOf })

              return true
            })
            .then((isError) => {
              const size = res.data.length
              const isSuccess = !isError
              const fileInfo = { isSuccess, fileName, mimeType, size, filePath }

              crawlRes.data = { ...res, data: fileInfo }

              if (callback) {
                callback(crawlRes)
              }
            })

          saveFileArr.push(saveFiletem)
        } else {
          if (callback) {
            callback(crawlRes)
          }
        }

        return crawlRes
      }
    )

    // 等待保存文件完成
    await Promise.all(saveFileArr)

    return crawlResArr
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
