import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { ControllerConfig, controller } from './controller'
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
  CrawlPageSingleRes,
  CrawlPageConfig,
  StartPollingConfig,
  MergeCrawlPageConfig,
  CrawlPageConfigObject,
  CrawlPageRes,
  MergeCrawlDataConfig,
  MergeCrawlFileConfig,
  CrawlDataSingleRes,
  CrawlDataRes,
  CrawlFileRequestConfig,
  CrawlFileRes,
  CrawlFileSingleRes,
  CrawlDataConfigObject
} from './types/api'
import { LoaderXCrawlBaseConfig } from './types'
import {
  DataRequestConfig,
  FileRequestConfig,
  PageRequestConfig,
  PageRequestConfigCookies
} from './types/request'

async function crawlRequestSingle(
  controllerConfig: ControllerConfig<DataRequestConfig & FileRequestConfig, any>
) {
  const { requestConfig } = controllerConfig

  return await request(requestConfig)
}

function parseCrawlPageCookies(
  url: string,
  cookies: PageRequestConfigCookies
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

function transformRequestConfig(
  config: string | string[] | PageRequestConfig | PageRequestConfig[]
): PageRequestConfig[]
function transformRequestConfig(
  config: string | string[] | DataRequestConfig | DataRequestConfig[]
): DataRequestConfig[]
function transformRequestConfig(config: any) {
  return isArray(config)
    ? config.map((item) => (isObject(item) ? item : { url: item }))
    : [isObject(config) ? config : { url: config }]
}

function mergePageConfig<T extends CrawlPageConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): MergeCrawlPageConfig {
  const newConfig: MergeCrawlPageConfig = { requestConfigs: [] }

  // 1.处理 requestConfig
  // 统一转成 PageRequestConfig 类型
  const rawRequestConfigArr: PageRequestConfig[] = []
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'requestConfigs')) {
    // CrawlPageConfigObject 处理
    const { requestConfigs, cookies, intervalTime, maxRetry } =
      rawConfig as CrawlPageConfigObject

    // 给 newConfig 进行赋值
    newConfig.cookies = cookies
    newConfig.intervalTime = intervalTime
    newConfig.maxRetry = maxRetry

    const transformRes = transformRequestConfig(requestConfigs)

    rawRequestConfigArr.push(...transformRes)
  } else {
    // string | string[] | PageRequestConfig | PageRequestConfig[] 处理

    const transformRes = transformRequestConfig(
      rawConfig as string | string[] | PageRequestConfig | PageRequestConfig[]
    )

    rawRequestConfigArr.push(...transformRes)
  }
  newConfig.requestConfigs = rawRequestConfigArr.map((item) => {
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
  if (
    isUndefined(newConfig.intervalTime) &&
    !isUndefined(baseConfig.intervalTime)
  ) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig
}

function mergeDataConfig<T extends CrawlDataConfig>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): MergeCrawlDataConfig {
  const newConfig: MergeCrawlDataConfig = { requestConfigs: [] }

  // 1.处理 requestConfig
  // 统一转成 DataRequestConfig 类型
  const rawRequestConfigArr: DataRequestConfig[] = []
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'requestConfigs')) {
    // CrawlDataConfigObject 处理
    const { requestConfigs, intervalTime, maxRetry } =
      rawConfig as CrawlDataConfigObject

    // 给 newConfig 进行赋值
    newConfig.intervalTime = intervalTime
    newConfig.maxRetry = maxRetry

    const transformRes = transformRequestConfig(requestConfigs)

    rawRequestConfigArr.push(...transformRes)
  } else {
    // string | string[] | DataRequestConfig | DataRequestConfig[] 处理

    const transformRes = transformRequestConfig(
      rawConfig as string | string[] | DataRequestConfig | DataRequestConfig[]
    )

    rawRequestConfigArr.push(...transformRes)
  }
  newConfig.requestConfigs = rawRequestConfigArr.map((item) => {
    const requestItem = isString(item) ? { url: item } : item
    const { url, timeout, proxy, maxRetry } = requestItem

    // 1.1.baseUrl
    if (!isUndefined(baseConfig.baseUrl)) {
      requestItem.url = baseConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout) && !isUndefined(baseConfig.timeout)) {
      requestItem.timeout = baseConfig.timeout
    }

    // 1.3.porxy
    if (isUndefined(proxy) && !isUndefined(baseConfig.proxy)) {
      requestItem.proxy = baseConfig.proxy
    }

    // 1.4.maxRetry
    // item > API Config > baseConfig
    if (isUndefined(maxRetry)) {
      if (!isUndefined(newConfig.maxRetry)) {
        // 取 API Config
        requestItem.maxRetry = newConfig.maxRetry
      } else if (!isUndefined(baseConfig.maxRetry)) {
        // 取 baseConfig
        requestItem.maxRetry = baseConfig.maxRetry
      }
    }

    return requestItem
  })

  // 2.处理 intervalTime
  if (
    isUndefined(newConfig.intervalTime) &&
    !isUndefined(baseConfig.intervalTime)
  ) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig
}

function mergeFileConfig<T extends CrawlFileConfig<CrawlFileRequestConfig>>(
  baseConfig: LoaderXCrawlBaseConfig,
  rawConfig: T
): MergeCrawlFileConfig {
  const newConfig: MergeCrawlFileConfig = {
    requestConfigs: [],
    fileConfig: rawConfig.fileConfig
  }

  // 1.处理 requestConfig
  const rawRequestConfigArr = isArray(rawConfig.requestConfig)
    ? rawConfig.requestConfig
    : [rawConfig.requestConfig]
  newConfig.requestConfigs = rawRequestConfigArr.map((item) => {
    const requestItem = isString(item) ? { url: item } : item
    const { url, timeout, proxy, maxRetry } = requestItem

    // 1.1.baseUrl
    if (!isUndefined(baseConfig.baseUrl)) {
      requestItem.url = baseConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout) && !isUndefined(baseConfig.timeout)) {
      requestItem.timeout = baseConfig.timeout
    }

    // 1.3.porxy
    if (isUndefined(proxy) && !isUndefined(baseConfig.proxy)) {
      requestItem.proxy = baseConfig.proxy
    }

    // 1.4.maxRetry
    // item > API Config > baseConfig
    if (isUndefined(maxRetry)) {
      if (!isUndefined(newConfig.maxRetry)) {
        // 取 API Config
        requestItem.maxRetry = newConfig.maxRetry
      } else if (!isUndefined(baseConfig.maxRetry)) {
        // 取 baseConfig
        requestItem.maxRetry = baseConfig.maxRetry
      }
    }

    return requestItem
  })

  // 2.处理 intervalTime
  if (
    isUndefined(rawConfig.intervalTime) &&
    !isUndefined(baseConfig.intervalTime)
  ) {
    newConfig.intervalTime = baseConfig.intervalTime
  }

  return newConfig
}

export function createCrawlPage(baseConfig: LoaderXCrawlBaseConfig) {
  let browser: Browser | null = null
  let createBrowserPending: Promise<void> | null = null
  let haveCreateBrowser = false

  let cIdCount = 0
  // 收集报错的 page : 因为 page 不管有没有失败都需要提供出去
  // 通过 爬取cId 找到对应爬取, 再通过 爬取id 找到 page
  const errorPageContainer = new Map<number, Map<number, Page>>()

  async function crawlPage<T extends CrawlPageConfig>(
    config: T,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageRes<T>> {
    const cId = ++cIdCount

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
    const { requestConfigs, intervalTime } = mergePageConfig(baseConfig, config)

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      cId,
      crawlPageSingle
    )

    const crawlResArr: CrawlPageSingleRes[] = controllerRes.map((item) => {
      const {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        crawlSingleRes
      } = item

      let data: {
        browser: Browser
        response: HTTPResponse | null
        page: Page
      } | null = null

      if (isSuccess && crawlSingleRes) {
        data = { browser: browser!, ...crawlSingleRes }
      } else {
        const page = errorPageContainer.get(cId)!.get(id)!
        data = { browser: browser!, response: null, page }
      }

      const crawlRes: CrawlPageSingleRes = {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        data
      }

      if (callback) {
        callback(crawlRes)
      }

      return crawlRes
    })

    // 避免内存泄露 (这次爬取报错的 page 已经处理完毕, 后续不会再利用)
    errorPageContainer.delete(cId)

    const crawlRes =
      isArray(config) ||
      (isObject(config) && Object.hasOwn(config, 'requestConfigs'))
        ? crawlResArr
        : crawlResArr[0]

    return crawlRes as CrawlPageRes<T>
  }

  async function crawlPageSingle(
    controllerConfig: ControllerConfig<PageRequestConfig, any>,
    cid: number
  ) {
    const { id, requestConfig } = controllerConfig
    const page = await browser!.newPage()
    await page.setViewport({ width: 1280, height: 1024 })

    let response: HTTPResponse | null = null
    try {
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

      response = await page.goto(requestConfig.url, {
        timeout: requestConfig.timeout
      })
    } catch (error) {
      // 收集报错的 page
      let container = errorPageContainer.get(cid!)
      if (!container) {
        container = new Map()
        errorPageContainer.set(cid!, container)
      }

      if (!container.get(id)) {
        container.set(id, page)
      }

      // 让外面收集错误
      throw error
    }

    return { response, page }
  }

  return crawlPage
}

export function createCrawlData(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlData<D, T extends CrawlDataConfig>(
    config: T,
    callback?: (res: CrawlDataSingleRes<D>) => void
  ): Promise<CrawlDataRes<D, T>> {
    const { requestConfigs, intervalTime } = mergeDataConfig(baseConfig, config)

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      undefined,
      crawlRequestSingle
    )

    const crawlResArr: CrawlDataSingleRes<D>[] = controllerRes.map((item) => {
      const {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        crawlSingleRes
      } = item

      const crawlRes: CrawlDataSingleRes<D> = {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        data: null
      }

      if (isSuccess && crawlSingleRes) {
        const contentType = crawlSingleRes.headers['content-type'] ?? ''

        const data: D = contentType.includes('text')
          ? crawlSingleRes.data.toString()
          : JSON.parse(crawlSingleRes.data.toString())

        crawlRes.data = { ...crawlSingleRes, data }
      }

      if (callback) {
        callback(crawlRes)
      }

      return crawlRes
    })

    const crawlRes =
      isArray(config) ||
      (isObject(config) && Object.hasOwn(config, 'requestConfigs'))
        ? crawlResArr
        : crawlResArr[0]

    return crawlRes as CrawlDataRes<D, T>
  }

  return crawlData
}

export function createCrawlFile(baseConfig: LoaderXCrawlBaseConfig) {
  async function crawlFile<R extends CrawlFileRequestConfig>(
    config: CrawlFileConfig<R>,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileRes<R>> {
    const { requestConfigs, intervalTime, fileConfig } = mergeFileConfig(
      baseConfig,
      config
    )

    if (!fs.existsSync(fileConfig.storeDir)) {
      fs.mkdirSync(fileConfig.storeDir)
    }

    const controllerRes = await controller(
      baseConfig.mode,
      requestConfigs,
      intervalTime,
      undefined,
      crawlRequestSingle
    )

    const saveFileQueue: Promise<void>[] = []
    const saveFileErrorArr: { message: string; valueOf: () => number }[] = []

    const crawlResArr: CrawlFileSingleRes[] = controllerRes.map((item) => {
      const {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        crawlSingleRes
      } = item

      const crawlRes: CrawlFileSingleRes = {
        id,
        isSuccess,
        maxRetry,
        retryCount,
        errorQueue,
        data: null
      }

      if (isSuccess && crawlSingleRes) {
        const mimeType = crawlSingleRes.headers['content-type'] ?? ''
        const fileExtension = fileConfig.extension ?? mimeType.split('/').pop()
        const fileName = new Date().getTime().toString()
        const filePath = path.resolve(
          fileConfig.storeDir,
          `${fileName}.${fileExtension}`
        )

        const saveFileItem = writeFile(filePath, crawlSingleRes.data)
          .catch((err) => {
            const message = `File save error at id ${id}: ${err.message}`
            const valueOf = () => id

            saveFileErrorArr.push({ message, valueOf })

            return true
          })
          .then((isError) => {
            const size = crawlSingleRes.data.length
            const isSuccess = !isError
            const fileInfo = { isSuccess, fileName, mimeType, size, filePath }

            crawlRes.data = { ...crawlSingleRes, data: fileInfo }

            if (callback) {
              callback(crawlRes)
            }
          })

        saveFileQueue.push(saveFileItem)
      } else {
        if (callback) {
          callback(crawlRes)
        }
      }

      return crawlRes
    })

    // 等待保存文件完成
    await Promise.all(saveFileQueue)

    const crawlRes = isArray(config.requestConfig)
      ? crawlResArr
      : crawlResArr[0]

    return crawlRes as CrawlFileRes<R>
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
