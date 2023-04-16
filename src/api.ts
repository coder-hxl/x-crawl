import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { ControllerConfig, controller } from './controller'
import { request } from './request'
import { quickSort } from './sort'
import {
  isArray,
  isObject,
  isUndefined,
  log,
  logError,
  logSuccess,
  logWarn,
  mkdirDirSync
} from './utils'

import {
  CrawlDataDetailConfig,
  CrawlFileDetailConfig,
  CrawlPageDetailConfig,
  PageCookies,
  UniteCrawlDataConfig,
  UniteCrawlFileConfig,
  CrawlPageSingleRes,
  UniteCrawlPageConfig,
  StartPollingConfig,
  LoaderCrawlPageConfig,
  CrawlPageEnhanceConfig,
  LoaderCrawlDataConfig,
  LoaderCrawlFileConfig,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  LoaderCrawlPageDetail,
  LoaderCrawlDataDetail,
  LoaderCrawlFileDetail,
  CrawlFileEnhanceConfig,
  CrawlDataEnhanceConfig
} from './types/api'
import { LoaderXCrawlConfig } from './types'

async function crawlRequestSingle(
  controllerConfig: ControllerConfig<
    LoaderCrawlDataDetail | LoaderCrawlFileDetail,
    any
  >
) {
  const { crawlDetailConfig } = controllerConfig

  return await request(crawlDetailConfig)
}

function parsePageCookies(
  url: string,
  cookies: PageCookies
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

function transformToCrawlDetails(
  config: string | CrawlPageDetailConfig | (string | CrawlPageDetailConfig)[]
): CrawlPageDetailConfig[]
function transformToCrawlDetails(
  config: string | CrawlDataDetailConfig | (string | CrawlDataDetailConfig)[]
): CrawlDataDetailConfig[]
function transformToCrawlDetails(
  config: (string | CrawlFileDetailConfig)[]
): CrawlFileDetailConfig[]
function transformToCrawlDetails(config: any) {
  return isArray(config)
    ? config.map((item) => (isObject(item) ? item : { url: item }))
    : [isObject(config) ? config : { url: config }]
}

function loaderCommonConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  rawCrawlDetails: (
    | CrawlPageDetailConfig
    | CrawlDataDetailConfig
    | CrawlFileDetailConfig
  )[],
  crawlAPIConfig:
    | LoaderCrawlPageConfig
    | LoaderCrawlDataConfig
    | LoaderCrawlFileConfig,
  crawlDetails: (
    | LoaderCrawlPageDetail
    | LoaderCrawlDataDetail
    | LoaderCrawlFileDetail
  )[]
) {
  // 1.rawCrawlDetails
  rawCrawlDetails.forEach((detail) => {
    // detail > API > xCrawl
    let { url, timeout, proxy, maxRetry, priority, headers } = detail

    // 1.1.baseUrl
    if (!isUndefined(xCrawlConfig.baseUrl)) {
      url = xCrawlConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout)) {
      if (!isUndefined(crawlAPIConfig.timeout)) {
        timeout = crawlAPIConfig.timeout
      } else {
        timeout = xCrawlConfig.timeout
      }
    }

    // 1.3.porxy
    if (isUndefined(proxy)) {
      if (!isUndefined(crawlAPIConfig.proxy)) {
        proxy = crawlAPIConfig.proxy
      } else if (!isUndefined(xCrawlConfig.proxy)) {
        proxy = xCrawlConfig.proxy
      }
    }

    // 1.4.maxRetry
    if (isUndefined(maxRetry)) {
      if (!isUndefined(crawlAPIConfig.maxRetry)) {
        maxRetry = crawlAPIConfig.maxRetry
      } else {
        maxRetry = xCrawlConfig.maxRetry
      }
    }

    // 1.5.priority
    if (isUndefined(priority)) {
      priority = 0
    }

    // 1.6.header
    if (isUndefined(headers)) {
      headers = crawlAPIConfig.headers
    }

    crawlDetails.push({
      ...detail,
      url,
      timeout,
      proxy,
      maxRetry,
      priority,
      headers
    })
  })

  // 2.intervalTime
  if (
    isUndefined(crawlAPIConfig.intervalTime) &&
    !isUndefined(xCrawlConfig.intervalTime)
  ) {
    crawlAPIConfig.intervalTime = xCrawlConfig.intervalTime
  }
}

function loaderPageConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  rawConfig: UniteCrawlPageConfig
): LoaderCrawlPageConfig {
  const crawlPageConfig: LoaderCrawlPageConfig = {
    crawlPageDetails: []
  }

  const rawCrawlPageDetails: CrawlPageDetailConfig[] = []
  // 统一转成 CrawlPageDetailConfig 类型
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'crawlPages')) {
    // CrawlPageEnhanceConfig 处理
    const { crawlPages } = rawConfig as CrawlPageEnhanceConfig

    // 给 crawlPageConfig 装载 CrawlPageEnhanceConfig
    const rawConfigMap: any = rawConfig
    const crawlPageConfigMap: any = crawlPageConfig
    Object.keys(rawConfig as CrawlPageEnhanceConfig).forEach((key) => {
      if (key === 'crawlPages') return
      crawlPageConfigMap[key] = rawConfigMap[key]
    })

    rawCrawlPageDetails.push(...transformToCrawlDetails(crawlPages))
  } else {
    // string | CrawlPageDetailConfig | (string | CrawlPageDetailConfig)[] 处理
    const transformRes = transformToCrawlDetails(
      rawConfig as
        | string
        | CrawlPageDetailConfig
        | (string | CrawlPageDetailConfig)[]
    )

    rawCrawlPageDetails.push(...transformRes)
  }

  // 装载公共配置
  loaderCommonConfig(
    xCrawlConfig,
    rawCrawlPageDetails,
    crawlPageConfig,
    crawlPageConfig.crawlPageDetails
  )

  // 装载单独配置
  const APIHaveCookies = !isUndefined(crawlPageConfig.cookies)
  const APIHaveViewport = !isUndefined(crawlPageConfig.viewport)
  crawlPageConfig.crawlPageDetails.forEach((detail) => {
    // detail > crawlConfig > xCrawl
    const { cookies, viewport } = detail

    // 1.cookies
    if (isUndefined(cookies) && APIHaveCookies) {
      detail.cookies = crawlPageConfig.cookies
    }

    // 2.viewport
    if (isUndefined(viewport) && APIHaveViewport) {
      detail.viewport = crawlPageConfig.viewport
    }
  })

  return crawlPageConfig
}

function loaderDataConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  rawConfig: UniteCrawlDataConfig
): LoaderCrawlDataConfig {
  const crawlDataConfig: LoaderCrawlDataConfig = {
    crawlDataDetails: []
  }

  const rawCrawlDataDetails: CrawlDataDetailConfig[] = []
  // 统一转成 CrawlDataDetailConfig 类型
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'crawlDatas')) {
    // CrawlDataEnhanceConfig 处理
    const { crawlDatas } = rawConfig as CrawlDataEnhanceConfig

    // 给 crawlDataConfig 装载 crawlDataEnhanceConfig
    const rawConfigMap: any = rawConfig
    const crawlDataConfigMap: any = crawlDataConfig
    Object.keys(rawConfig as CrawlDataEnhanceConfig).forEach((key) => {
      if (key === 'crawlDatas') return
      crawlDataConfigMap[key] = rawConfigMap[key]
    })

    rawCrawlDataDetails.push(...transformToCrawlDetails(crawlDatas))
  } else {
    // string | CrawlDataDetailConfig | (string | CrawlDataDetailConfig)[] 处理
    const transformRes = transformToCrawlDetails(
      rawConfig as
        | string
        | CrawlDataDetailConfig
        | (string | CrawlDataDetailConfig)[]
    )

    rawCrawlDataDetails.push(...transformToCrawlDetails(transformRes))
  }

  // 装载公共配置
  loaderCommonConfig(
    xCrawlConfig,
    rawCrawlDataDetails,
    crawlDataConfig,
    crawlDataConfig.crawlDataDetails
  )

  return crawlDataConfig
}

function loaderFileConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  rawConfig: UniteCrawlFileConfig
): LoaderCrawlFileConfig {
  const crawlFileConfig: LoaderCrawlFileConfig = {
    crawlFileDetails: []
  }

  const rawCrawlFileDetails: CrawlFileDetailConfig[] = []
  // 统一转成 CrawlFileDetailConfig 类型
  if (isObject(rawConfig) && Object.hasOwn(rawConfig, 'crawlFiles')) {
    // CrawlFileMoreConfig 处理
    const { crawlFiles } = rawConfig as CrawlFileEnhanceConfig

    // 给 crawlFileConfig 装载 crawlFileMoreConfig
    const rawConfigMap: any = rawConfig
    const crawlFileConfigMap: any = crawlFileConfig
    Object.keys(rawConfig as CrawlFileEnhanceConfig).forEach((key) => {
      if (key === 'crawlFiles') return
      crawlFileConfigMap[key] = rawConfigMap[key]
    })

    rawCrawlFileDetails.push(...transformToCrawlDetails(crawlFiles))
  } else {
    // CrawlFileDetailConfig | CrawlFileDetailConfig[] 处理
    rawCrawlFileDetails.push(
      ...(isArray(rawConfig) ? rawConfig : [rawConfig as CrawlFileDetailConfig])
    )
  }

  // 装载公共配置
  loaderCommonConfig(
    xCrawlConfig,
    rawCrawlFileDetails,
    crawlFileConfig,
    crawlFileConfig.crawlFileDetails
  )

  // 装载单独配置
  if (
    !isUndefined(crawlFileConfig?.storeDir) ||
    !isUndefined(crawlFileConfig?.extension)
  ) {
    crawlFileConfig.crawlFileDetails.forEach((fileSingleConfig) => {
      // 1.storeDir
      if (
        isUndefined(fileSingleConfig.storeDir) &&
        !isUndefined(crawlFileConfig?.storeDir)
      ) {
        fileSingleConfig.storeDir = crawlFileConfig!.storeDir
      }

      // 2.extension
      if (
        isUndefined(fileSingleConfig.extension) &&
        !isUndefined(crawlFileConfig?.extension)
      ) {
        fileSingleConfig.extension = crawlFileConfig!.extension
      }
    })
  }

  return crawlFileConfig
}

export function createCrawlPage(xCrawlConfig: LoaderXCrawlConfig) {
  let browser: Browser | null = null
  let createBrowserPending: Promise<void> | null = null
  let haveCreateBrowser = false

  let cIdCount = 0
  // 收集报错的 page : 因为 page 不管有没有失败都需要提供出去
  // 通过 爬取cId 找到对应爬取, 再通过 爬取id 找到 page
  const errorPageContainer = new Map<number, Map<number, Page>>()

  function crawlPage(
    config: string,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  function crawlPage(
    config: CrawlPageDetailConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  function crawlPage(
    config: (string | CrawlPageDetailConfig)[],
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes[]>

  function crawlPage(
    config: CrawlPageEnhanceConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes[]>

  async function crawlPage(
    config: UniteCrawlPageConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes | CrawlPageSingleRes[]> {
    const cId = ++cIdCount

    //  创建浏览器
    if (!haveCreateBrowser) {
      haveCreateBrowser = true
      createBrowserPending = puppeteer
        .launch(xCrawlConfig.crawlPage?.launchBrowser)
        .then((res) => {
          browser = res
        })
    }

    // 等待浏览器创建完毕
    if (createBrowserPending) {
      await createBrowserPending
      // 防止对 createBrowserPending 重复赋值
      if (createBrowserPending) createBrowserPending = null
    }

    // 装载配置
    const { crawlPageDetails, intervalTime } = loaderPageConfig(
      xCrawlConfig,
      config
    )

    const controllerRes = await controller(
      'page',
      xCrawlConfig.mode,
      crawlPageDetails,
      intervalTime,
      cId,
      crawlPageSingle
    )

    const crawlResArr: CrawlPageSingleRes[] = controllerRes.map((item) => {
      const {
        id,
        isSuccess,
        maxRetry,
        crawlCount,
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
        crawlCount,
        retryCount: crawlCount - 1,
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
      (isObject(config) && Object.hasOwn(config, 'crawlPages'))
        ? crawlResArr
        : crawlResArr[0]

    return crawlRes
  }

  async function crawlPageSingle(
    controllerConfig: ControllerConfig<LoaderCrawlPageDetail, any>,
    cid: number
  ) {
    const { id, crawlDetailConfig } = controllerConfig
    const page = await browser!.newPage()
    await page.setViewport({
      width: crawlDetailConfig.viewport?.width ?? 1280,
      height: crawlDetailConfig.viewport?.width ?? 1024
    })

    let response: HTTPResponse | null = null
    try {
      if (crawlDetailConfig.proxy) {
        await browser!.createIncognitoBrowserContext({
          proxyServer: crawlDetailConfig.proxy
        })
      } else {
        await browser!.createIncognitoBrowserContext({
          proxyServer: undefined
        })
      }

      if (crawlDetailConfig.headers) {
        await page.setExtraHTTPHeaders(
          crawlDetailConfig.headers as any as Record<string, string>
        )
      }

      if (crawlDetailConfig.cookies) {
        await page.setCookie(
          ...parsePageCookies(crawlDetailConfig.url, crawlDetailConfig.cookies)
        )
      }

      response = await page.goto(crawlDetailConfig.url, {
        timeout: crawlDetailConfig.timeout
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

export function createCrawlData(xCrawlConfig: LoaderXCrawlConfig) {
  function crawlData<T = any>(
    config: string,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  function crawlData<T = any>(
    config: CrawlDataDetailConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  function crawlData<T = any>(
    config: (string | CrawlDataDetailConfig)[],
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  function crawlData<T = any>(
    config: CrawlDataEnhanceConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  async function crawlData<T = any>(
    config: UniteCrawlDataConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T> | CrawlDataSingleRes<T>[]> {
    const { crawlDataDetails, intervalTime } = loaderDataConfig(
      xCrawlConfig,
      config
    )

    const controllerRes = await controller(
      'data',
      xCrawlConfig.mode,
      crawlDataDetails,
      intervalTime,
      undefined,
      crawlRequestSingle
    )

    const crawlResArr: CrawlDataSingleRes<T>[] = controllerRes.map((item) => {
      const {
        id,
        isSuccess,
        maxRetry,
        crawlCount,
        errorQueue,
        crawlSingleRes
      } = item

      const crawlRes: CrawlDataSingleRes<T> = {
        id,
        isSuccess,
        maxRetry,
        crawlCount,
        retryCount: crawlCount - 1,
        errorQueue,
        data: null
      }

      if (isSuccess && crawlSingleRes) {
        const contentType = crawlSingleRes.headers['content-type'] ?? ''

        const data: T = contentType.includes('text')
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
      (isObject(config) && Object.hasOwn(config, 'crawlDatas'))
        ? crawlResArr
        : crawlResArr[0]

    return crawlRes
  }

  return crawlData
}

export function createCrawlFile(xCrawlConfig: LoaderXCrawlConfig) {
  function crawlFile(
    config: CrawlFileDetailConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes>

  function crawlFile(
    config: CrawlFileDetailConfig[],
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes[]>

  function crawlFile(
    config: CrawlFileEnhanceConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes[]>

  async function crawlFile(
    config: UniteCrawlFileConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes | CrawlFileSingleRes[]> {
    const { crawlFileDetails, intervalTime, onBeforeSaveFile } =
      loaderFileConfig(xCrawlConfig, config)

    const controllerRes = await controller(
      'file',
      xCrawlConfig.mode,
      crawlFileDetails,
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
        crawlCount,
        errorQueue,
        crawlSingleRes,
        crawlDetailConfig
      } = item

      const crawlRes: CrawlFileSingleRes = {
        id,
        isSuccess,
        maxRetry,
        crawlCount,
        retryCount: crawlCount - 1,
        errorQueue,
        data: null
      }

      if (isSuccess && crawlSingleRes) {
        const mimeType = crawlSingleRes.headers['content-type'] ?? ''

        const fileName =
          crawlDetailConfig.fileName ?? `${id}-${new Date().getTime()}`
        const fileExtension =
          crawlDetailConfig.extension ?? `.${mimeType.split('/').pop()}`

        if (
          !isUndefined(crawlDetailConfig.storeDir) &&
          !fs.existsSync(crawlDetailConfig.storeDir)
        ) {
          mkdirDirSync(crawlDetailConfig.storeDir)
        }

        const storePath = crawlDetailConfig.storeDir ?? __dirname
        const filePath = path.resolve(storePath, fileName + fileExtension)

        // 在保存前的回调
        const data = crawlSingleRes.data
        let dataPromise = Promise.resolve(data)
        if (onBeforeSaveFile) {
          dataPromise = onBeforeSaveFile({
            id,
            fileName,
            filePath,
            data
          })
        }

        const saveFileItem = dataPromise.then(async (newData) => {
          let isSuccess = true
          try {
            await writeFile(filePath, newData)
          } catch (err: any) {
            isSuccess = false

            const message = `File save error at id ${id}: ${err.message}`
            const valueOf = () => id

            saveFileErrorArr.push({ message, valueOf })
          }

          const size = newData.length
          crawlRes.data = {
            ...crawlSingleRes,
            data: {
              isSuccess,
              fileName,
              fileExtension,
              mimeType,
              size,
              filePath
            }
          }

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

    // 打印保存错误
    quickSort(saveFileErrorArr).forEach((item) => log(logError(item.message)))

    // 统计保存
    const succssIds: number[] = []
    const errorIds: number[] = []
    crawlResArr.forEach((item) => {
      if (item.data?.data.isSuccess) {
        succssIds.push(item.id)
      } else {
        errorIds.push(item.id)
      }
    })
    log('Save file final result:')
    log(
      logSuccess(
        `  Success - total: ${succssIds.length}, ids: [ ${succssIds.join(
          ' - '
        )} ]`
      )
    )
    log(
      logError(
        `    Error - total: ${errorIds.length}, ids: [ ${errorIds.join(
          ' - '
        )} ]`
      )
    )

    const crawlRes =
      isArray(config) ||
      (isObject(config) && Object.hasOwn(config, 'crawlFiles'))
        ? crawlResArr
        : crawlResArr[0]

    return crawlRes
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
