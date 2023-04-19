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
  mkdirDirSync,
  random
} from './utils'

import {
  CrawlDataDetailTargetConfig,
  CrawlFileDetailTargetConfig,
  CrawlPageDetailTargetConfig,
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

export type LoaderCrawlPageDetail = CrawlPageDetailTargetConfig &
  LoaderHasConfig

export type LoaderCrawlDataDetail = CrawlDataDetailTargetConfig &
  LoaderHasConfig

export type LoaderCrawlFileDetail = CrawlFileDetailTargetConfig &
  LoaderHasConfig

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
  detailTargets: CrawlPageDetailTargetConfig[]
  intervalTime: IntervalTime | undefined
  onCrawlItemComplete:
    | ((crawlPageSingleRes: CrawlPageSingleRes) => void)
    | undefined
}

interface CrawlDataConfigOriginal {
  detailTargets: CrawlDataDetailTargetConfig[]
  intervalTime: IntervalTime | undefined
  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<any>) => void)
    | undefined
}

interface CrawlFileConfigOriginal {
  detailTargets: CrawlFileDetailTargetConfig[]
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
  | CrawlPageDetailTargetConfig
  | (string | CrawlPageDetailTargetConfig)[]
  | CrawlPageAdvancedConfig

type UniteCrawlDataConfig<T> =
  | string
  | CrawlDataDetailTargetConfig
  | (string | CrawlDataDetailTargetConfig)[]
  | CrawlDataAdvancedConfig<T>

type UniteCrawlFileConfig =
  | CrawlFileDetailTargetConfig
  | CrawlFileDetailTargetConfig[]
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
  config:
    | string
    | CrawlPageDetailTargetConfig
    | (string | CrawlPageDetailTargetConfig)[]
): CrawlPageDetailTargetConfig[]
function transformToDetailTargets(
  config:
    | string
    | CrawlDataDetailTargetConfig
    | (string | CrawlDataDetailTargetConfig)[]
): CrawlDataDetailTargetConfig[]
function transformToDetailTargets(
  config: (string | CrawlFileDetailTargetConfig)[]
): CrawlFileDetailTargetConfig[]
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
    const { url, timeout, proxy, maxRetry, priority, headers, fingerprint } =
      detail

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

    // 1.7.fingerprint(公共部分)
    if (fingerprint) {
      const { userAgent, ua, platform, mobile, acceptLanguage } = fingerprint
      let headers = detail.headers

      if (!headers) {
        detail.headers = headers = {}
      }

      // 1.user-agent
      if (userAgent) {
        headers['user-agent'] = userAgent
      }

      // 2.sec-ch-ua
      if (ua) {
        headers['sec-ch-ua'] = ua
      }

      // 3.sec-ch-platform
      if (platform) {
        headers['sec-ch-platform'] = platform
      }

      // 4.sec-ch-mobile
      if (mobile) {
        headers['sec-ch-mobile'] = mobile
      }

      // 4.accept-language
      if (acceptLanguage) {
        headers['accept-language'] = acceptLanguage
      }
    } else if (isUndefined(fingerprint) && advancedConfig.fingerprint) {
      const { userAgents, uas, platforms, mobiles, acceptLanguages } =
        advancedConfig.fingerprint
      let headers = detail.headers

      if (!headers) {
        detail.headers = headers = {}
      }

      // 1.user-agent
      if (userAgents) {
        headers['user-agent'] = userAgents[random(userAgents.length)]
      }

      // 2.sec-ch-ua
      if (uas) {
        headers['sec-ch-ua'] = uas[random(uas.length)]
      }

      // 3.sec-ch-platform
      if (platforms) {
        headers['sec-ch-platform'] = platforms[random(platforms.length)]
      }

      // 4.sec-ch-mobile
      if (mobiles) {
        headers['sec-ch-mobile'] = mobiles[random(mobiles.length)]
      }

      // 4.accept-language
      if (acceptLanguages) {
        headers['accept-language'] =
          acceptLanguages[random(acceptLanguages.length)]
      }
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

function loaderPageDetailTargetFingerprint(
  detail: CrawlPageDetailTargetConfig,
  fingerprint: {
    maxWidth: number
    minWidth?: number
    maxHeight: number
    minHidth?: number
  }
) {
  const { maxWidth, minWidth, maxHeight, minHidth } = fingerprint

  // 1.width / height
  const width = maxWidth === minWidth ? maxWidth : random(maxWidth, minWidth)
  const height =
    maxHeight === minHidth ? maxHeight : random(maxHeight, minHidth)
  const viewport = detail.viewport
  if (!viewport) {
    detail.viewport = { width, height }
  } else {
    viewport.width = width
    viewport.height = height
  }
}

/* Create Config */
/*
  每个创建配置函数的返回值都是类似于进阶版配置
  不同点:
    - detailTargets 里面将存放的是详细版目标配置
    - 不会保留与详细版目标配置相同的选项

  生成 advancedConfig 对象对每个详细版目标配置进行装载, 如果是传入进阶版配置会覆盖生成的 advancedConfig 对象
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
    // string | CrawlPageDetailTargetConfig | (string | CrawlPageDetailTargetConfig)[] 处理
    const detaileTargets = transformToDetailTargets(
      originalConfig as
        | string
        | CrawlPageDetailTargetConfig
        | (string | CrawlPageDetailTargetConfig)[]
    )

    crawlPageConfig.detailTargets.push(...detaileTargets)
  }

  // 装载公共配置
  loaderCommonConfig(xCrawlConfig, advancedConfig, crawlPageConfig)

  // 装载单独配置
  crawlPageConfig.detailTargets.forEach((detail) => {
    // detail > advanced  > xCrawl
    const { cookies, viewport, fingerprint } = detail

    // 1.cookies
    if (isUndefined(cookies) && advancedConfig.cookies) {
      detail.cookies = advancedConfig.cookies
    }

    // 2.viewport
    if (isUndefined(viewport) && advancedConfig.viewport) {
      detail.viewport = advancedConfig.viewport
    }

    // 3.fingerprint
    if (fingerprint) {
      loaderPageDetailTargetFingerprint(detail, fingerprint)
    } else if (isUndefined(fingerprint) && advancedConfig.fingerprint) {
      loaderPageDetailTargetFingerprint(detail, advancedConfig.fingerprint)
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
    // string | CrawlDataDetailTargetConfig | (string | CrawlDataDetailTargetConfig)[] 处理
    const detaileTargets = transformToDetailTargets(
      originalConfig as
        | string
        | CrawlDataDetailTargetConfig
        | (string | CrawlDataDetailTargetConfig)[]
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
    // CrawlFileDetailTargetConfig |  CrawlFileDetailTargetConfig[] 处理
    crawlFileConfig.detailTargets.push(
      ...(isArray(originalConfig)
        ? originalConfig
        : [originalConfig as CrawlFileDetailTargetConfig])
    )
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

  if (detailTarget.viewport) {
    await page.setViewport(detailTarget.viewport)
  }

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
      const cookies = parsePageCookies(detailTarget.url, detailTarget.cookies)
      await page.setCookie(...cookies)
    } else {
      const cookies = await page.cookies(detailTarget.url)
      await page.deleteCookie(...cookies)
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

    if (detailTarget.storeDir && !fs.existsSync(detailTarget.storeDir)) {
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
    config: CrawlPageDetailTargetConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  function crawlPage(
    config: (string | CrawlPageDetailTargetConfig)[],
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
    config: CrawlDataDetailTargetConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  function crawlData<T = any>(
    config: (string | CrawlDataDetailTargetConfig)[],
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
    config: CrawlFileDetailTargetConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes>

  function crawlFile(
    config: CrawlFileDetailTargetConfig[],
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
