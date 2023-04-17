import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { DetailInfo, controller } from './controller'
import { Request, request } from './request'
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
import { AnyObject } from './types/common'

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

// Extra config
export interface ExtraCommonConfig {
  intervalTime: IntervalTime | undefined
}

interface ExtraPageConfig extends ExtraCommonConfig {
  // 存放报错的 Page
  errorPageMap: Map<number, Page>

  browser: Browser
  onCrawlItemComplete:
    | ((crawlPageSingleRes: CrawlPageSingleRes) => void)
    | undefined
}

interface ExtraDataConfig<T> extends ExtraCommonConfig {
  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<T>) => void)
    | undefined
}

interface ExtraFileConfig extends ExtraCommonConfig {
  saveFileErrorArr: { message: string; valueOf: () => number }[]
  saveFilePendingQueue: Promise<any>[]
  onCrawlItemComplete:
    | ((crawlFileSingleRes: CrawlFileSingleRes) => void)
    | undefined
  onBeforeSaveFile:
    | ((info: {
        id: number
        fileName: string
        filePath: string
        data: Buffer
      }) => Promise<Buffer>)
    | undefined
}

// Single crawl result
interface PageSingleCrawlResult {
  response: HTTPResponse | null
  page: Page
}

// Create config
interface CrawlPageConfigOriginal {
  detailTargets: CrawlPageDetailConfig[]
  intervalTime: IntervalTime | undefined
  onCrawlItemComplete:
    | ((crawlPageSingleRes: CrawlPageSingleRes) => void)
    | undefined
}

interface CrawlDataConfigOriginal {
  detailTargets: CrawlDataDetailConfig[]
  intervalTime: IntervalTime | undefined
  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<any>) => void)
    | undefined
}

interface CrawlFileConfigOriginal {
  detailTargets: CrawlFileDetailConfig[]
  intervalTime: IntervalTime | undefined
  onBeforeSaveFile:
    | ((info: {
        id: number
        fileName: string
        filePath: string
        data: Buffer
      }) => Promise<Buffer>)
    | undefined
  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<any>) => void)
    | undefined
}

type CrawlPageConfig = Omit<CrawlPageConfigOriginal, 'detailTargets'> & {
  detailTargets: LoaderCrawlPageDetail[]
}

type CrawlDataConfig = Omit<CrawlDataConfigOriginal, 'detailTargets'> & {
  detailTargets: LoaderCrawlDataDetail[]
}

type CrawlFileConfig = Omit<CrawlFileConfigOriginal, 'detailTargets'> & {
  detailTargets: LoaderCrawlFileDetail[]
}

// API unite config
type UniteCrawlPageConfig =
  | string
  | CrawlPageDetailConfig
  | (string | CrawlPageDetailConfig)[]
  | CrawlPageAdvancedConfig

type UniteCrawlDataConfig<T> =
  | string
  | CrawlDataDetailConfig
  | (string | CrawlDataDetailConfig)[]
  | CrawlDataAdvancedConfig<T>

type UniteCrawlFileConfig =
  | CrawlFileDetailConfig
  | CrawlFileDetailConfig[]
  | CrawlFileAdvancedConfig

/* Function */

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

function transformToDetailTargets(
  config: string | CrawlPageDetailConfig | (string | CrawlPageDetailConfig)[]
): CrawlPageDetailConfig[]
function transformToDetailTargets(
  config: string | CrawlDataDetailConfig | (string | CrawlDataDetailConfig)[]
): CrawlDataDetailConfig[]
function transformToDetailTargets(
  config: (string | CrawlFileDetailConfig)[]
): CrawlFileDetailConfig[]
function transformToDetailTargets(config: any) {
  return isArray(config)
    ? config.map((item) => (isObject(item) ? item : { url: item }))
    : [isObject(config) ? config : { url: config }]
}

function loaderCommonConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  advancedConfig:
    | CrawlPageAdvancedConfig
    | CrawlDataAdvancedConfig<any>
    | CrawlFileAdvancedConfig,
  crawlConfig:
    | CrawlPageConfigOriginal
    | CrawlDataConfigOriginal
    | CrawlFileConfigOriginal
) {
  // 1.detailTargets
  crawlConfig.detailTargets.forEach((detail) => {
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
  crawlConfig.intervalTime = advancedConfig.intervalTime
  if (
    isUndefined(advancedConfig.intervalTime) &&
    !isUndefined(xCrawlConfig.intervalTime)
  ) {
    crawlConfig.intervalTime = xCrawlConfig.intervalTime
  }

  // 3.onCrawlItemComplete
  crawlConfig.onCrawlItemComplete = advancedConfig.onCrawlItemComplete
}

/* Create Config */
/*
  每个创建配置函数的返回值都是类似于对应的进阶版(类似 CrawlAdvancedConfig)配置
  不同点:
    - detailTargets 里面存放的是详细版(类似 CrawlDetailConfig)配置
    - 不会保留与详细版配置相同的选项

  生成 advancedConfig 对象可以对每个详细版配置进行装载, 如果传入进阶版(类似 CrawlAdvancedConfig)配置会覆盖生成的
*/

function createCrawlPageConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlPageConfig
): CrawlPageConfig {
  const crawlPageConfig: CrawlPageConfigOriginal = {
    detailTargets: [],
    intervalTime: undefined,
    onCrawlItemComplete: undefined
  }

  let advancedConfig: CrawlPageAdvancedConfig = { targets: [] }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlPageAdvancedConfig 处理
    const { targets } = originalConfig as CrawlPageAdvancedConfig
    advancedConfig = originalConfig as CrawlPageAdvancedConfig

    crawlPageConfig.detailTargets.push(...transformToDetailTargets(targets))
  } else {
    // string | CrawlPageDetailConfig | (string | CrawlPageDetailConfig)[] 处理
    const detaileTargets = transformToDetailTargets(
      originalConfig as
        | string
        | CrawlPageDetailConfig
        | (string | CrawlPageDetailConfig)[]
    )

    crawlPageConfig.detailTargets.push(...detaileTargets)
  }

  // 装载公共配置
  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlPageConfig)

  // 装载单独配置
  const haveAdvancedCookies = !isUndefined(advancedConfig.cookies)
  const haveAdvancedViewport = !isUndefined(advancedConfig.viewport)
  crawlPageConfig.detailTargets.forEach((detail) => {
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

function createCrawlDataConfig<T>(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlDataConfig<T>
): CrawlDataConfig {
  const crawlDataConfig: CrawlDataConfigOriginal = {
    detailTargets: [],
    intervalTime: undefined,
    onCrawlItemComplete: undefined
  }

  let advancedConfig: CrawlDataAdvancedConfig<T> = { targets: [] }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlDataAdvancedConfig 处理
    const { targets } = originalConfig as CrawlDataAdvancedConfig<T>
    advancedConfig = originalConfig as CrawlDataAdvancedConfig<T>

    crawlDataConfig.detailTargets.push(...transformToDetailTargets(targets))
  } else {
    // string | CrawlDataDetailConfig | (string | CrawlDataDetailConfig)[] 处理
    const detaileTargets = transformToDetailTargets(
      originalConfig as
        | string
        | CrawlDataDetailConfig
        | (string | CrawlDataDetailConfig)[]
    )

    crawlDataConfig.detailTargets.push(...detaileTargets)
  }

  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlDataConfig)

  return crawlDataConfig as CrawlDataConfig
}

function createCrawlFileConfig(
  xCrawlConfig: LoaderXCrawlConfig,
  originalConfig: UniteCrawlFileConfig
): CrawlFileConfig {
  const crawlFileConfig: CrawlFileConfigOriginal = {
    detailTargets: [],
    intervalTime: undefined,
    onBeforeSaveFile: undefined,
    onCrawlItemComplete: undefined
  }

  let advancedConfig: CrawlFileAdvancedConfig = { targets: [] }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlFileAdvancedConfig 处理
    const { targets } = originalConfig as CrawlFileAdvancedConfig

    advancedConfig = originalConfig as CrawlFileAdvancedConfig
    crawlFileConfig.detailTargets.push(...transformToDetailTargets(targets))
  } else {
    // string | CrawlFileDetailConfig | (string | CrawlFileDetailConfig)[] 处理
    const detailTargets = transformToDetailTargets(
      originalConfig as
        | string
        | CrawlFileDetailConfig
        | (string | CrawlFileDetailConfig)[]
    )

    crawlFileConfig.detailTargets.push(...detailTargets)
  }

  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlFileConfig)

  const haveAdvancedStoreDir = !isUndefined(advancedConfig?.storeDir)
  const haveAdvancedExtension = !isUndefined(advancedConfig?.extension)
  crawlFileConfig.detailTargets.forEach((detail) => {
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

/* Single crawl handle */

async function pageSingleCrawlHandle(
  detaileInfo: DetailInfo<LoaderCrawlPageDetail, PageSingleCrawlResult>,
  extraConfig: ExtraPageConfig
): Promise<PageSingleCrawlResult> {
  const { id, detailTarget } = detaileInfo
  const { errorPageMap, browser } = extraConfig

  const page = await browser.newPage()
  await page.setViewport({
    width: detailTarget.viewport?.width ?? 1280,
    height: detailTarget.viewport?.width ?? 1024
  })

  let response: HTTPResponse | null = null
  try {
    if (detailTarget.proxy) {
      await browser.createIncognitoBrowserContext({
        proxyServer: detailTarget.proxy
      })
    } else {
      await browser.createIncognitoBrowserContext({
        proxyServer: undefined
      })
    }

    if (detailTarget.cookies) {
      await page.setCookie(
        ...parsePageCookies(detailTarget.url, detailTarget.cookies)
      )
    }

    if (detailTarget.headers) {
      await page.setExtraHTTPHeaders(detailTarget.headers)
    }

    response = await page.goto(detailTarget.url, {
      timeout: detailTarget.timeout
    })
  } catch (error) {
    // 收集报错的 page
    if (!errorPageMap.get(id)) {
      errorPageMap.set(id, page)
    }

    // 让外面收集错误
    throw error
  }

  return { response, page }
}

async function dataAndFileSingleCrawlHandle(
  detaileInfo: DetailInfo<
    LoaderCrawlDataDetail | LoaderCrawlFileDetail,
    Request
  >
) {
  const { detailTarget } = detaileInfo

  return await request(detailTarget)
}

/* Single result handle */

function pageSingleResultHandle(
  detaileInfo: DetailInfo<LoaderCrawlPageDetail, PageSingleCrawlResult>,
  extraConfig: ExtraPageConfig
) {
  const { id, isSuccess, detailTargetRes } = detaileInfo
  const { errorPageMap, browser, onCrawlItemComplete } = extraConfig

  let data: {
    browser: Browser
    response: HTTPResponse | null
    page: Page
  } | null = null

  if (isSuccess && detailTargetRes) {
    data = { browser: browser!, ...detailTargetRes }
  } else {
    const page = errorPageMap.get(id)!

    data = { browser: browser!, response: null, page }
  }

  detaileInfo.data = data

  const crawlPageSingleRes: AnyObject = detaileInfo
  delete crawlPageSingleRes.detailTarget
  delete crawlPageSingleRes.detailTargetRes

  if (onCrawlItemComplete) {
    onCrawlItemComplete(crawlPageSingleRes as CrawlPageSingleRes)
  }
}

function fileSingleResultHandle(
  detaileInfo: DetailInfo<LoaderCrawlFileDetail, Request>,
  extraConfig: ExtraFileConfig
) {
  const { id, isSuccess, detailTarget, detailTargetRes } = detaileInfo
  const {
    saveFileErrorArr,
    saveFilePendingQueue,

    onCrawlItemComplete,
    onBeforeSaveFile
  } = extraConfig

  const crawlFileSingleRes: AnyObject = detaileInfo
  delete crawlFileSingleRes.detailTarget
  delete crawlFileSingleRes.detailTargetRes

  if (isSuccess && detailTargetRes) {
    const mimeType = detailTargetRes.headers['content-type'] ?? ''

    const fileName = detailTarget.fileName ?? `${id}-${new Date().getTime()}`
    const fileExtension =
      detailTarget.extension ?? `.${mimeType.split('/').pop()}`

    if (
      !isUndefined(detailTarget.storeDir) &&
      !fs.existsSync(detailTarget.storeDir)
    ) {
      mkdirDirSync(detailTarget.storeDir)
    }

    const storePath = detailTarget.storeDir ?? __dirname
    const filePath = path.resolve(storePath, fileName + fileExtension)

    // 在保存前的回调
    const data = detailTargetRes.data
    let dataPromise = Promise.resolve(data)
    if (onBeforeSaveFile) {
      dataPromise = onBeforeSaveFile({
        id,
        fileName,
        filePath,
        data
      })
    }

    const saveFileItemPending = dataPromise.then(async (newData) => {
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
      detaileInfo.data = {
        ...detailTargetRes,
        data: {
          isSuccess,
          fileName,
          fileExtension,
          mimeType,
          size,
          filePath
        }
      }

      if (onCrawlItemComplete) {
        onCrawlItemComplete(crawlFileSingleRes as CrawlFileSingleRes)
      }
    })

    // 存放保存文件 Promise , 后续等待即可回到 crawlFile 函数内部等待完成即可
    saveFilePendingQueue.push(saveFileItemPending)
  } else {
    if (onCrawlItemComplete) {
      onCrawlItemComplete(crawlFileSingleRes as CrawlFileSingleRes)
    }
  }
}

/* Create crawl API */

export function createCrawlPage(xCrawlConfig: LoaderXCrawlConfig) {
  let browser: Browser | null = null
  let createBrowserPending: Promise<void> | null = null
  let haveCreateBrowser = false

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
    const { detailTargets, intervalTime, onCrawlItemComplete } =
      createCrawlPageConfig(xCrawlConfig, config)

    const extraConfig: ExtraPageConfig = {
      errorPageMap: new Map(),
      browser: browser!,
      intervalTime,
      onCrawlItemComplete
    }

    const crawlResArr = (await controller(
      'page',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      pageSingleCrawlHandle,
      pageSingleResultHandle
    )) as CrawlPageSingleRes[]

    const crawlRes =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
        ? crawlResArr
        : crawlResArr[0]

    if (callback) {
      callback(crawlRes)
    }

    return crawlRes
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
    config: CrawlDataAdvancedConfig<T>,
    callback?: (res: CrawlDataSingleRes<T>[]) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  async function crawlData<T = any>(
    config: UniteCrawlDataConfig<T>,
    callback?: (res: any) => void
  ): Promise<CrawlDataSingleRes<T> | CrawlDataSingleRes<T>[]> {
    const { detailTargets, intervalTime, onCrawlItemComplete } =
      createCrawlDataConfig(xCrawlConfig, config)

    function dataSingleResultHandle(
      detaileInfo: DetailInfo<LoaderCrawlDataDetail, Request>,
      extraConfig: ExtraDataConfig<T>
    ) {
      const { isSuccess, detailTargetRes } = detaileInfo
      const { onCrawlItemComplete } = extraConfig

      if (isSuccess && detailTargetRes) {
        const contentType = detailTargetRes.headers['content-type'] ?? ''

        const data: T = contentType.includes('text')
          ? detailTargetRes.data.toString()
          : JSON.parse(detailTargetRes.data.toString())

        detaileInfo.data = { ...detailTargetRes, data }
      }

      const crawlDataSingleRes: AnyObject = detaileInfo
      delete crawlDataSingleRes.detailTarget
      delete crawlDataSingleRes.detailTargetRes

      if (onCrawlItemComplete) {
        onCrawlItemComplete(crawlDataSingleRes as CrawlDataSingleRes<T>)
      }
    }

    const extraConfig: ExtraDataConfig<T> = {
      intervalTime,
      onCrawlItemComplete
    }

    const crawlResArr = (await controller(
      'data',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      dataAndFileSingleCrawlHandle,
      dataSingleResultHandle
    )) as CrawlDataSingleRes<T>[]

    const crawlRes =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
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
    const {
      detailTargets,
      intervalTime,
      onBeforeSaveFile,
      onCrawlItemComplete
    } = createCrawlFileConfig(xCrawlConfig, config)

    const extraConfig: ExtraFileConfig = {
      saveFileErrorArr: [],
      saveFilePendingQueue: [],

      intervalTime,
      onCrawlItemComplete,
      onBeforeSaveFile
    }

    const crawlResArr = (await controller(
      'file',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      dataAndFileSingleCrawlHandle,
      fileSingleResultHandle
    )) as CrawlFileSingleRes[]

    const { saveFilePendingQueue, saveFileErrorArr } = extraConfig

    // 等待保存文件完成
    await Promise.all(saveFilePendingQueue)

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
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
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
