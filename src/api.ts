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
  CrawlPageSingleRes,
  StartPollingConfig,
  CrawlPageAdvancedConfig,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  CrawlFileAdvancedConfig,
  CrawlDataAdvancedConfig,
  IntervalTime
} from './types/api'
import { LoaderXCrawlConfig } from './types'

/* Types */

// Loader
type LoaderHasConfig = {
  timeout: number
  maxRetry: number
  priority: number
}

export type LoaderCrawlPageDetail = CrawlPageDetailConfig & LoaderHasConfig

export type LoaderCrawlDataDetail = CrawlDataDetailConfig & LoaderHasConfig

export type LoaderCrawlFileDetail = CrawlFileDetailConfig & LoaderHasConfig

// Create config
interface CrawlPageConfigOriginal {
  crawlDetails: CrawlPageDetailConfig[]
  intervalTime: IntervalTime | undefined
}

type CrawlPageConfig = Omit<CrawlPageConfigOriginal, 'crawlDetails'> & {
  crawlDetails: LoaderCrawlPageDetail[]
}

interface CrawlDataConfigOriginal {
  crawlDetails: CrawlDataDetailConfig[]
  intervalTime: IntervalTime | undefined
}

type CrawlDataConfig = Omit<CrawlDataConfigOriginal, 'crawlDetails'> & {
  crawlDetails: LoaderCrawlDataDetail[]
}

interface CrawlFileConfigOriginal {
  crawlDetails: CrawlFileDetailConfig[]
  intervalTime: IntervalTime | undefined
  onBeforeSaveFile:
    | ((info: {
        id: number
        fileName: string
        filePath: string
        data: Buffer
      }) => Promise<Buffer>)
    | undefined
}

type CrawlFileConfig = Omit<CrawlFileConfigOriginal, 'crawlDetails'> & {
  crawlDetails: LoaderCrawlFileDetail[]
}

// API config
type UniteCrawlPageConfig =
  | string
  | CrawlPageDetailConfig
  | (string | CrawlPageDetailConfig)[]
  | CrawlPageAdvancedConfig

type UniteCrawlDataConfig =
  | string
  | CrawlDataDetailConfig
  | (string | CrawlDataDetailConfig)[]
  | CrawlDataAdvancedConfig

type UniteCrawlFileConfig =
  | CrawlFileDetailConfig
  | CrawlFileDetailConfig[]
  | CrawlFileAdvancedConfig

/* Function */

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
  advancedConfig:
    | CrawlPageAdvancedConfig
    | CrawlDataAdvancedConfig
    | CrawlFileAdvancedConfig,
  crawlConfig:
    | CrawlPageConfigOriginal
    | CrawlDataConfigOriginal
    | CrawlFileConfigOriginal
) {
  // 1.crawlDetails
  crawlConfig.crawlDetails.forEach((detail) => {
    // detail > advanced > app
    const { url, timeout, proxy, maxRetry, priority, headers } = detail

    // 1.1.baseUrl
    if (!isUndefined(xCrawlConfig.baseUrl)) {
      detail.url = xCrawlConfig.baseUrl + url
    }

    // 1.2.timeout
    if (isUndefined(timeout)) {
      if (!isUndefined(advancedConfig.timeout)) {
        detail.timeout = advancedConfig.timeout
      } else {
        detail.timeout = xCrawlConfig.timeout
      }
    }

    // 1.3.porxy
    if (isUndefined(proxy)) {
      if (!isUndefined(advancedConfig.proxy)) {
        detail.proxy = advancedConfig.proxy
      } else if (!isUndefined(xCrawlConfig.proxy)) {
        detail.proxy = xCrawlConfig.proxy
      }
    }

    // 1.4.maxRetry
    if (isUndefined(maxRetry)) {
      if (!isUndefined(advancedConfig.maxRetry)) {
        detail.maxRetry = advancedConfig.maxRetry
      } else {
        detail.maxRetry = xCrawlConfig.maxRetry
      }
    }

    // 1.5.priority
    if (isUndefined(priority)) {
      detail.priority = 0
    }

    // 1.6.header
    if (isUndefined(headers)) {
      detail.headers = advancedConfig.headers
    }
  })

  // 2.intervalTime
  if (
    isUndefined(advancedConfig.intervalTime) &&
    !isUndefined(xCrawlConfig.intervalTime)
  ) {
    crawlConfig.intervalTime = xCrawlConfig.intervalTime
  }
}

/* Create Config */
/*
  每个创建配置函数的返回值都是类似于对应的进阶版(CrawlAdvancedConfig)配置
  不同点:
    - crawlDetails 里面存放的是详细版(CrawlDetailConfig)配置
    - 不会保留与详细版配置相同的选项

  生成 advancedConfig 对象可以对每个详细版配置进行装载, 如果传入进阶版(CrawlAdvancedConfig)配置会覆盖生成的
*/

function createCrawlPageConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlPageConfig
): CrawlPageConfig {
  const crawlPageConfig: CrawlPageConfigOriginal = {
    crawlDetails: [],
    intervalTime: undefined
  }

  let advancedConfig: CrawlPageAdvancedConfig = {
    crawlPages: []
  }

  // 将每个 crawls 配置转成 detail 类型的配置
  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'crawlPages')) {
    // CrawlPageAdvancedConfig 处理
    const { crawlPages } = originalConfig as CrawlPageAdvancedConfig
    advancedConfig = originalConfig as CrawlPageAdvancedConfig

    crawlPageConfig.crawlDetails.push(...transformToCrawlDetails(crawlPages))
  } else {
    // string | CrawlPageDetailConfig | (string | CrawlPageDetailConfig)[] 处理
    const detailes = transformToCrawlDetails(
      originalConfig as
        | string
        | CrawlPageDetailConfig
        | (string | CrawlPageDetailConfig)[]
    )

    crawlPageConfig.crawlDetails.push(...detailes)
  }

  // 装载公共配置
  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlPageConfig)

  // 装载单独配置
  const haveAdvancedCookies = !isUndefined(advancedConfig.cookies)
  const haveAdvancedViewport = !isUndefined(advancedConfig.viewport)
  crawlPageConfig.crawlDetails.forEach((detail) => {
    // detail > advanced  > xCrawl
    const { cookies, viewport } = detail

    // 1.cookies
    if (isUndefined(cookies) && haveAdvancedCookies) {
      detail.cookies = advancedConfig.cookies
    }

    // 2.viewport
    if (isUndefined(viewport) && haveAdvancedViewport) {
      detail.viewport = advancedConfig.viewport
    }
  })

  return crawlPageConfig as CrawlPageConfig
}

function createCrawlDataConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlDataConfig
): CrawlDataConfig {
  const crawlDataConfig: CrawlDataConfigOriginal = {
    crawlDetails: [],
    intervalTime: undefined
  }

  let advancedConfig: CrawlDataAdvancedConfig = {
    crawlDatas: []
  }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'crawlDatas')) {
    // CrawlDataAdvancedConfig 处理
    const { crawlDatas } = originalConfig as CrawlDataAdvancedConfig
    advancedConfig = originalConfig as CrawlDataAdvancedConfig

    crawlDataConfig.crawlDetails.push(...transformToCrawlDetails(crawlDatas))
  } else {
    // string | CrawlDataDetailConfig | (string | CrawlDataDetailConfig)[] 处理
    const crawlDatas = transformToCrawlDetails(
      originalConfig as
        | string
        | CrawlDataDetailConfig
        | (string | CrawlDataDetailConfig)[]
    )

    crawlDataConfig.crawlDetails.push(...crawlDatas)
  }

  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlDataConfig)

  return crawlDataConfig as CrawlDataConfig
}

function createCrawlFileConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlFileConfig
): CrawlFileConfig {
  const crawlFileConfig: CrawlFileConfigOriginal = {
    crawlDetails: [],
    intervalTime: undefined,
    onBeforeSaveFile: undefined
  }

  let advancedConfig: CrawlFileAdvancedConfig = { crawlFiles: [] }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'crawlFiles')) {
    // CrawlFileAdvancedConfig 处理
    const { crawlFiles } = originalConfig as CrawlFileAdvancedConfig

    advancedConfig = originalConfig as CrawlFileAdvancedConfig
    crawlFileConfig.crawlDetails.push(...transformToCrawlDetails(crawlFiles))
  } else {
    // string | CrawlFileDetailConfig | (string | CrawlFileDetailConfig)[] 处理
    const crawlFiles = transformToCrawlDetails(
      originalConfig as
        | string
        | CrawlFileDetailConfig
        | (string | CrawlFileDetailConfig)[]
    )

    crawlFileConfig.crawlDetails.push(...crawlFiles)
  }

  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlFileConfig)

  const haveAdvancedStoreDir = !isUndefined(advancedConfig?.storeDir)
  const haveAdvancedExtension = !isUndefined(advancedConfig?.extension)
  crawlFileConfig.crawlDetails.forEach((detail) => {
    // 1.storeDir
    if (isUndefined(detail.storeDir) && haveAdvancedStoreDir) {
      detail.storeDir = advancedConfig!.storeDir
    }

    // 2.extension
    if (isUndefined(detail.extension) && haveAdvancedExtension) {
      detail.extension = advancedConfig!.extension
    }
  })

  crawlFileConfig.onBeforeSaveFile = advancedConfig.onBeforeSaveFile

  return crawlFileConfig as CrawlFileConfig
}

/* createCrawlAPI */

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
    callback?: (res: CrawlPageSingleRes[]) => void
  ): Promise<CrawlPageSingleRes[]>

  function crawlPage(
    config: CrawlPageAdvancedConfig,
    callback?: (res: CrawlPageSingleRes[]) => void
  ): Promise<CrawlPageSingleRes[]>

  async function crawlPage(
    config: UniteCrawlPageConfig,
    callback?: (res: any) => void
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

    // 创建新配置
    const { crawlDetails, intervalTime } = createCrawlPageConfig(
      xCrawlConfig,
      config
    )

    const controllerRes = await controller(
      'page',
      xCrawlConfig.mode,
      crawlDetails,
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

      return crawlRes
    })

    // 避免内存泄露 (这次爬取报错的 page 已经处理完毕, 后续不会再利用)
    errorPageContainer.delete(cId)

    const crawlRes =
      isArray(config) ||
      (isObject(config) && Object.hasOwn(config, 'crawlPages'))
        ? crawlResArr
        : crawlResArr[0]

    if (callback) {
      callback(crawlRes)
    }

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
    callback?: (res: CrawlDataSingleRes<T>[]) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  function crawlData<T = any>(
    config: CrawlDataAdvancedConfig,
    callback?: (res: CrawlDataSingleRes<T>[]) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  async function crawlData<T = any>(
    config: UniteCrawlDataConfig,
    callback?: (res: any) => void
  ): Promise<CrawlDataSingleRes<T> | CrawlDataSingleRes<T>[]> {
    const { crawlDetails, intervalTime } = createCrawlDataConfig(
      xCrawlConfig,
      config
    )

    const controllerRes = await controller(
      'data',
      xCrawlConfig.mode,
      crawlDetails,
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

      return crawlRes
    })

    const crawlRes =
      isArray(config) ||
      (isObject(config) && Object.hasOwn(config, 'crawlDatas'))
        ? crawlResArr
        : crawlResArr[0]

    if (callback) {
      callback(crawlRes)
    }

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
    callback?: (res: CrawlFileSingleRes[]) => void
  ): Promise<CrawlFileSingleRes[]>

  function crawlFile(
    config: CrawlFileAdvancedConfig,
    callback?: (res: CrawlFileSingleRes[]) => void
  ): Promise<CrawlFileSingleRes[]>

  async function crawlFile(
    config: UniteCrawlFileConfig,
    callback?: (res: any) => void
  ): Promise<CrawlFileSingleRes | CrawlFileSingleRes[]> {
    const { crawlDetails, intervalTime, onBeforeSaveFile } =
      createCrawlFileConfig(xCrawlConfig, config)

    const controllerRes = await controller(
      'file',
      xCrawlConfig.mode,
      crawlDetails,
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
        })

        saveFileQueue.push(saveFileItem)
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

    if (callback) {
      callback(crawlRes)
    }

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
