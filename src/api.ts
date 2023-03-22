import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import puppeteer, { Browser } from 'puppeteer'

import { batchRequest, syncBatchRequest } from './request'
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
  CrawlDataConfig,
  CrawlFileConfig,
  CrawlPage,
  CrawlPageConfig,
  CrawlResCommonArrV1,
  CrawlResCommonV1,
  FileInfo,
  IntervalTime,
  MergeConfigRawConfig,
  MergeConfigV1,
  MergeConfigV2,
  StartPollingConfig
} from './types/api'
import { LoaderXCrawlBaseConfig } from './types'
import { RequestResItem, RequestConfigObjectV2 } from './types/request'

function mergeConfig<R, T extends MergeConfigRawConfig = MergeConfigRawConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): R {
  const newConfig = structuredClone(rawConfig)

  // 1.处理 requestConfig
  const rawRequestConfigArr = isArray(newConfig.requestConfig)
    ? newConfig.requestConfig
    : [newConfig.requestConfig]

  // item 转成对象
  const requestConfigArr = (newConfig.requestConfig = rawRequestConfigArr.map(
    (item) => {
      if (isString(item)) return { url: item }
      return item
    }
  ))

  for (const requestItem of requestConfigArr) {
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
  }

  // 2.处理 intervalTime
  if (isUndefined(newConfig.intervalTime)) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig as any as R
}

async function useBatchRequestByMode(
  mode: 'async' | 'sync',
  requestConfigs: RequestConfigObjectV2[],
  intervalTime: IntervalTime | undefined,
  callback: (requestRestem: RequestResItem) => void
) {
  if (mode === 'async') {
    await batchRequest(requestConfigs, intervalTime, callback)
  } else {
    await syncBatchRequest(requestConfigs, intervalTime, callback)
  }
}

export function createCrawlPage(baseConfig: LoaderXCrawlBaseConfig) {
  let browser: Browser | null = null
  let createBrowserState: Promise<void> | null = null
  let haveCreateBrowser = false

  async function crawlPage(
    config: CrawlPageConfig,
    callback?: (res: CrawlPage) => void
  ): Promise<CrawlPage> {
    // 创建浏览器
    if (!haveCreateBrowser) {
      haveCreateBrowser = true
      createBrowserState = puppeteer.launch().then((res) => {
        browser = res
      })
    }

    // 等待浏览器创建完毕
    if (createBrowserState) {
      await Promise.all([createBrowserState])
      createBrowserState = null
    }

    const page = await browser!.newPage()
    await page.setViewport({ width: 1280, height: 1024 })

    // 合并 baseConfig 配置
    const { requestConfig: requestConfigs } = mergeConfig<MergeConfigV1>(
      baseConfig,
      {
        requestConfig: config
      }
    )
    const requestConfig = requestConfigs[0]

    // 处理代理
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
      await page.setExtraHTTPHeaders(Headers as any as Record<string, string>)
    }

    let httpResponse = null
    try {
      httpResponse = await page!.goto(requestConfig.url, {
        timeout: requestConfig.timeout
      })
    } catch (error: any) {
      console.log(logError(`Error: ${error.message}`))
    }

    let content = ''
    try {
      content = await page!.content()
    } catch {}

    const res: CrawlPage = {
      httpResponse,
      browser: browser!,
      page,
      jsdom: new JSDOM(content)
    }

    if (callback) {
      callback(res)
    }

    return res
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
    function handleRestem(requestRestem: RequestResItem) {
      const contentType = requestRestem.headers['content-type'] ?? ''
      const rawData = requestRestem.data

      const data = contentType.includes('text')
        ? rawData.toString()
        : JSON.parse(rawData.toString())

      const itemRes = { ...requestRestem, data }

      if (callback) {
        callback(itemRes)
      }

      container.push(itemRes)
    }

    await useBatchRequestByMode(
      baseConfig.mode,
      requestConfig,
      intervalTime,
      handleRestem
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

    const container: CrawlResCommonArrV1<FileInfo> = []
    const saveFileArr: Promise<void>[] = []
    const saveFileErrorArr: { message: string; valueOf: () => number }[] = []

    if (!fs.existsSync(fileConfig.storeDir)) {
      fs.mkdirSync(fileConfig.storeDir)
    }

    function handleRestem(requestRestem: RequestResItem) {
      const { id, headers, data } = requestRestem

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
            ...requestRestem,
            data: { fileName, mimeType, size: data.length, filePath }
          }

          if (callback) {
            callback(res)
          }

          container.push(res)
        })

      saveFileArr.push(saveFiletem)
    }

    await useBatchRequestByMode(
      baseConfig.mode,
      requestConfig,
      intervalTime,
      handleRestem
    )

    // 等待保存文件任务完成
    await Promise.all(saveFileArr)

    // 打印保存文件的错误
    quickSort(saveFileErrorArr).forEach((item) => log(logError(item.message)))

    const saveFileTotal = isArray(requestConfig) ? requestConfig.length : 1
    const success = container.length
    const error = saveFileTotal - success
    log(
      `saveFileTotal: ${logNumber(saveFileTotal)}, success: ${logSuccess(
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
