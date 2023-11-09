import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { Device, controller, isCrawlStatusInHttpStatus } from './controller'
import { Request, request } from './request'
import { quickSort } from './sort'
import {
  isArray,
  isObject,
  isString,
  isUndefined,
  log,
  logError,
  logStart,
  logStatistics,
  logSuccess,
  logWarn,
  random,
  whiteBold
} from './utils'

import {
  CrawlDataDetailTargetConfig,
  CrawlFileDetailTargetConfig,
  CrawlPageDetailTargetConfig,
  PageCookies,
  CrawlPageSingleResult,
  StartPollingConfig,
  CrawlPageAdvancedConfig,
  CrawlDataSingleResult,
  CrawlFileSingleResult,
  CrawlFileAdvancedConfig,
  CrawlDataAdvancedConfig,
  IntervalTime,
  DetailTargetFingerprintCommon,
  CrawlHTMLSingleResult,
  CrawlHTMLDetailTargetConfig,
  CrawlHTMLAdvancedConfig
} from './types/api'
import { LogConfig, XCrawlInstanceConfig } from './types'
import { fingerprints } from './default'

/* Types */

// Group API config

export interface InfoCommonConfig {
  serialNumber: string
  mode: 'async' | 'sync'
  type: 'page' | 'html' | 'data' | 'file'
  logConfig: LogConfig
  intervalTime: IntervalTime | undefined
}

interface InfoPageConfig extends InfoCommonConfig {
  type: 'page'

  browser: Browser
  onCrawlItemComplete:
    | ((crawlPageSingleResult: CrawlPageSingleResult) => void)
    | undefined
}

interface InfoHTMLConfig extends InfoCommonConfig {
  type: 'html'

  onCrawlItemComplete:
    | ((crawlHTMLSingleResult: CrawlHTMLSingleResult) => void)
    | undefined
}

interface InfoDataConfig<T> extends InfoCommonConfig {
  type: 'data'

  onCrawlItemComplete:
    | ((crawlDataSingleResult: CrawlDataSingleResult<T>) => void)
    | undefined
}

interface InfoFileConfig extends InfoCommonConfig {
  type: 'file'

  saveFileErrorArr: { message: string; valueOf: () => number }[]
  saveFilePendingQueue: Promise<any>[]
  onCrawlItemComplete:
    | ((crawlFileSingleResult: CrawlFileSingleResult) => void)
    | undefined
  onBeforeSaveItemFile:
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
// Loader
export type ProxyDetails = { url: string; state: boolean }[]

type LoaderCommonConfig = {
  proxyUrl?: string
  proxyDetails: ProxyDetails
}

type LoaderHasConfig = {
  timeout?: number
  maxRetry: number
  priority: number
}

export type LoaderCrawlPageDetail = LoaderCommonConfig &
  LoaderHasConfig &
  CrawlPageDetailTargetConfig

export type LoaderCrawlHTMLDetail = LoaderCommonConfig &
  LoaderHasConfig &
  CrawlHTMLDetailTargetConfig

export type LoaderCrawlDataDetail = LoaderCommonConfig &
  LoaderHasConfig &
  CrawlDataDetailTargetConfig

export type LoaderCrawlFileDetail = LoaderCommonConfig &
  LoaderHasConfig &
  CrawlFileDetailTargetConfig

//  AdvancedDetailTargets
interface CrawlPageAdvancedDetailTargetsConfig extends CrawlPageAdvancedConfig {
  detailTargets: CrawlPageDetailTargetConfig[]
}

interface CrawlHTMLAdvancedDetailTargetsConfig extends CrawlHTMLAdvancedConfig {
  detailTargets: CrawlHTMLDetailTargetConfig[]
}

interface CrawlDataAdvancedDetailTargetsConfig<T>
  extends CrawlDataAdvancedConfig<T> {
  detailTargets: CrawlDataDetailTargetConfig[]
}

interface CrawlFileAdvancedDetailTargetsConfig extends CrawlFileAdvancedConfig {
  detailTargets: CrawlFileDetailTargetConfig[]
}

// CrawlConfig
interface CrawlPageConfig {
  detailTargets: LoaderCrawlPageDetail[]
  intervalTime: IntervalTime | undefined

  selectFingerprintIndexs: number[]

  onCrawlItemComplete:
    | ((crawlPageSingleResult: CrawlPageSingleResult) => void)
    | undefined
}

interface CrawlHTMLConfig {
  detailTargets: LoaderCrawlHTMLDetail[]
  intervalTime: IntervalTime | undefined

  selectFingerprintIndexs: number[]

  onCrawlItemComplete:
    | ((crawlHTMLSingleResult: CrawlHTMLSingleResult) => void)
    | undefined
}

interface CrawlDataConfig {
  detailTargets: LoaderCrawlDataDetail[]
  intervalTime: IntervalTime | undefined

  selectFingerprintIndexs: number[]

  onCrawlItemComplete:
    | ((crawlDataSingleResult: CrawlDataSingleResult<any>) => void)
    | undefined
}

interface CrawlFileConfig {
  detailTargets: LoaderCrawlFileDetail[]
  intervalTime: IntervalTime | undefined

  selectFingerprintIndexs: number[]

  onBeforeSaveItemFile:
    | ((info: {
        id: number
        fileName: string
        filePath: string
        data: Buffer
      }) => Promise<Buffer>)
    | undefined
  onCrawlItemComplete:
    | ((crawlDataSingleResult: CrawlDataSingleResult<any>) => void)
    | undefined
}

// API unite config
type UniteCrawlPageConfig =
  | string
  | CrawlPageDetailTargetConfig
  | (string | CrawlPageDetailTargetConfig)[]
  | CrawlPageAdvancedConfig

type UniteCrawlHTMLConfig =
  | string
  | CrawlHTMLDetailTargetConfig
  | (string | CrawlHTMLDetailTargetConfig)[]
  | CrawlHTMLAdvancedConfig

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

function transformTargetToDetailTargets(
  config:
    | string
    | CrawlPageDetailTargetConfig
    | (string | CrawlPageDetailTargetConfig)[]
): CrawlPageDetailTargetConfig[]
function transformTargetToDetailTargets(
  config:
    | string
    | CrawlDataDetailTargetConfig
    | (string | CrawlDataDetailTargetConfig)[]
): CrawlDataDetailTargetConfig[]
function transformTargetToDetailTargets(
  config: (string | CrawlFileDetailTargetConfig)[]
): CrawlFileDetailTargetConfig[]
function transformTargetToDetailTargets(config: any) {
  return isArray(config)
    ? config.map((item) => (isObject(item) ? item : { url: item }))
    : [isObject(config) ? config : { url: config }]
}

/* Loader config */

function loaderCommonFingerprintToDetailTarget(
  detail:
    | CrawlPageDetailTargetConfig
    | CrawlDataDetailTargetConfig
    | CrawlFileDetailTargetConfig,
  fingerprint: DetailTargetFingerprintCommon
) {
  const { ua, platform, platformVersion, mobile, acceptLanguage, userAgent } =
    fingerprint

  let headers = detail.headers

  if (!headers) {
    detail.headers = headers = {}
  }

  // 1.sec-ch-ua
  if (ua) {
    headers['sec-ch-ua'] = ua
  }

  // 2.sec-ch-ua-mobile
  if (mobile) {
    headers['sec-ch-ua-mobile'] =
      mobile === 'random' ? (random(2) ? '?1' : '?0') : mobile
  }

  // 3.sec-ch-platform
  if (platform) {
    headers['sec-ch-platform'] = platform
  }

  // 4.sec-ch-ua-platform-version
  if (platformVersion) {
    headers['sec-ch-ua-platform-version'] = platformVersion
  }

  // 5.accept-language
  if (acceptLanguage) {
    headers['accept-language'] = acceptLanguage
  }

  // 6.user-agent
  if (userAgent) {
    let value = userAgent.value

    userAgent.versions?.forEach((version) => {
      const {
        name,
        maxMajorVersion,
        minMajorVersion,
        maxMinorVersion,
        minMinorVersion,
        maxPatchVersion,
        minPatchVersion
      } = version

      const nameSplit = value.split(`${name}/`)
      const versionSplit: any[] = nameSplit[1].split(' ')[0].split('.')
      const originalVersion = versionSplit.join('.')

      if (!isUndefined(maxMajorVersion)) {
        versionSplit[0] =
          maxMajorVersion === minMajorVersion
            ? maxMajorVersion
            : random(maxMajorVersion, minMajorVersion)
      }

      if (!isUndefined(maxMinorVersion)) {
        versionSplit[1] =
          maxMinorVersion === minMinorVersion
            ? maxMinorVersion
            : random(maxMinorVersion, minMinorVersion)
      }

      if (!isUndefined(maxPatchVersion)) {
        versionSplit[2] =
          maxPatchVersion === minPatchVersion
            ? maxPatchVersion
            : random(maxPatchVersion, minPatchVersion)
      }

      const searchValue = `${name}/${originalVersion}`
      const replaceValue = `${name}/${versionSplit.join('.')}`
      value = value.replace(searchValue, replaceValue)
    })

    headers['user-agent'] = value
  }
}

function loaderPageFingerprintToDetailTarget(
  detail: CrawlPageDetailTargetConfig,
  fingerprint: {
    maxWidth?: number
    minWidth?: number
    maxHeight?: number
    minHidth?: number
  }
) {
  const { maxWidth, minWidth, maxHeight, minHidth } = fingerprint

  const viewport: any = detail.viewport ?? {}
  // 1.width / height
  if (maxWidth) {
    viewport.width =
      maxWidth === minWidth ? maxWidth : random(maxWidth, minWidth)
  }

  if (maxHeight) {
    viewport.height =
      maxHeight === minHidth ? maxHeight : random(maxHeight, minHidth)
  }

  if (Object.hasOwn(viewport, 'width') && Object.hasOwn(viewport, 'height')) {
    detail.viewport = viewport
  }
}

function loaderCommonConfigToCrawlConfig(
  xCrawlInstanceConfig: XCrawlInstanceConfig,
  advancedDetailTargetsConfig:
    | CrawlPageAdvancedDetailTargetsConfig
    | CrawlHTMLAdvancedDetailTargetsConfig
    | CrawlDataAdvancedDetailTargetsConfig<any>
    | CrawlFileAdvancedDetailTargetsConfig,
  crawlConfig:
    | CrawlPageConfig
    | CrawlHTMLConfig
    | CrawlDataConfig
    | CrawlFileConfig
) {
  // 1.detailTargets
  crawlConfig.detailTargets = advancedDetailTargetsConfig.detailTargets.map(
    (rawDetail) => {
      // detail > advanced > app

      const detail = rawDetail as
        | LoaderCrawlPageDetail
        | LoaderCrawlDataDetail
        | LoaderCrawlFileDetail

      const { url, timeout, proxy, maxRetry, priority, headers, fingerprint } =
        detail

      // 1.1.baseUrl
      if (xCrawlInstanceConfig.baseUrl) {
        detail.url = xCrawlInstanceConfig.baseUrl + url
      }

      // 1.2.timeout
      if (isUndefined(timeout)) {
        if (!isUndefined(advancedDetailTargetsConfig.timeout)) {
          detail.timeout = advancedDetailTargetsConfig.timeout ?? undefined
        } else {
          detail.timeout = xCrawlInstanceConfig.timeout
        }
      }

      // 1.3.maxRetry
      if (isUndefined(maxRetry)) {
        if (!isUndefined(advancedDetailTargetsConfig.maxRetry)) {
          detail.maxRetry = advancedDetailTargetsConfig.maxRetry ?? 0
        } else {
          detail.maxRetry = xCrawlInstanceConfig.maxRetry
        }
      }

      // 1.4.proxy
      if (isUndefined(proxy)) {
        if (!isUndefined(advancedDetailTargetsConfig.proxy)) {
          detail.proxy = advancedDetailTargetsConfig.proxy
        } else if (!isUndefined(xCrawlInstanceConfig.proxy)) {
          detail.proxy = xCrawlInstanceConfig.proxy
        }
      }

      // 1.5.proxyUrl & proxyDetail
      if (!isUndefined(detail.proxy?.urls)) {
        const urls = detail.proxy!.urls
        detail.proxyUrl = urls[0]
        detail.proxyDetails = urls.map((url) => ({ url, state: true }))
      } else {
        // 默认值
        detail.proxyDetails = []
      }

      // 1.6.priority
      if (isUndefined(priority)) {
        detail.priority = 0
      }

      // 1.7.header
      if (isUndefined(headers) && advancedDetailTargetsConfig.headers) {
        detail.headers = { ...advancedDetailTargetsConfig.headers }
      }

      // 1.8.fingerprint(公共部分)
      if (fingerprint) {
        // detaileTarget

        loaderCommonFingerprintToDetailTarget(detail, fingerprint)
      } else if (
        isUndefined(fingerprint) &&
        isArray(advancedDetailTargetsConfig.fingerprints) &&
        advancedDetailTargetsConfig.fingerprints.length
      ) {
        // advancedConfig

        const fingerprints = advancedDetailTargetsConfig.fingerprints
        const selectFingerprintIndex = random(fingerprints.length)
        const fingerprint = fingerprints[selectFingerprintIndex]

        // 记录每个目标选中的指纹索引
        crawlConfig.selectFingerprintIndexs.push(selectFingerprintIndex)

        loaderCommonFingerprintToDetailTarget(detail, fingerprint)
      } else if (
        isUndefined(fingerprint) &&
        !isArray(advancedDetailTargetsConfig.fingerprints) &&
        xCrawlInstanceConfig.enableRandomFingerprint
      ) {
        // xCrawlInstanceConfig
        const fingerprint = fingerprints[random(fingerprints.length)]

        loaderCommonFingerprintToDetailTarget(detail, fingerprint)
      }

      return detail
    }
  )

  // 2.intervalTime
  crawlConfig.intervalTime = advancedDetailTargetsConfig.intervalTime
  if (
    isUndefined(advancedDetailTargetsConfig.intervalTime) &&
    !isUndefined(xCrawlInstanceConfig.intervalTime)
  ) {
    crawlConfig.intervalTime = xCrawlInstanceConfig.intervalTime
  }

  // 3.onCrawlItemComplete
  crawlConfig.onCrawlItemComplete =
    advancedDetailTargetsConfig.onCrawlItemComplete
}

/* Create config */
/*
  每个创建配置函数的返回值都是类似于进阶配置
  不同点:
    - detailTargets 里面将存放的是详细版目标配置
    - 不会保留与详细版目标配置相同的选项

  生成 advancedConfig 对象对每个详细版目标配置进行装载, 如果是传入进阶版配置会覆盖生成的 advancedConfig 对象
*/

function createCrawlPageConfig(
  xCrawlInstanceConfig: XCrawlInstanceConfig,
  originalConfig: UniteCrawlPageConfig
): CrawlPageConfig {
  const crawlPageConfig: CrawlPageConfig = {
    detailTargets: [],
    intervalTime: undefined,

    selectFingerprintIndexs: [],

    onCrawlItemComplete: undefined
  }

  let advancedDetailTargetsConfig: CrawlPageAdvancedDetailTargetsConfig = {
    targets: [],
    detailTargets: []
  }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlPageAdvancedConfig 处理
    const { targets } = originalConfig as CrawlPageAdvancedConfig

    advancedDetailTargetsConfig =
      originalConfig as CrawlPageAdvancedDetailTargetsConfig
    advancedDetailTargetsConfig.detailTargets =
      transformTargetToDetailTargets(targets)
  } else {
    // string | CrawlPageDetailTargetConfig | (string | CrawlPageDetailTargetConfig)[] 处理
    advancedDetailTargetsConfig.detailTargets = transformTargetToDetailTargets(
      originalConfig as
        | string
        | CrawlPageDetailTargetConfig
        | (string | CrawlPageDetailTargetConfig)[]
    )
  }

  // 装载公共配置
  loaderCommonConfigToCrawlConfig(
    xCrawlInstanceConfig,
    advancedDetailTargetsConfig,
    crawlPageConfig
  )

  // 装载单独配置
  crawlPageConfig.detailTargets.forEach((detail, index) => {
    // detail > advanced  > xCrawl
    const { cookies, viewport, fingerprint } = detail

    // 1.cookies
    if (isUndefined(cookies) && advancedDetailTargetsConfig.cookies) {
      detail.cookies = advancedDetailTargetsConfig.cookies
    }

    // 2.viewport
    if (isUndefined(viewport) && advancedDetailTargetsConfig.viewport) {
      detail.viewport = advancedDetailTargetsConfig.viewport
    }

    // 3.fingerprint
    if (fingerprint) {
      loaderPageFingerprintToDetailTarget(detail, fingerprint)
    } else if (
      isUndefined(fingerprint) &&
      advancedDetailTargetsConfig.fingerprints?.length
    ) {
      // 从对应的选中记录中取出指纹索引
      const selectFingerprintIndex =
        crawlPageConfig.selectFingerprintIndexs[index]
      const fingerprint =
        advancedDetailTargetsConfig.fingerprints[selectFingerprintIndex]

      loaderPageFingerprintToDetailTarget(detail, fingerprint)
    }
  })

  return crawlPageConfig
}

function createCrawlHTMLConfig(
  xCrawlInstanceConfig: XCrawlInstanceConfig,
  originalConfig: UniteCrawlHTMLConfig
): CrawlHTMLConfig {
  const crawlHTMLConfig: CrawlHTMLConfig = {
    detailTargets: [],
    intervalTime: undefined,

    selectFingerprintIndexs: [],

    onCrawlItemComplete: undefined
  }

  let advancedDetailTargetsConfig: CrawlHTMLAdvancedDetailTargetsConfig = {
    targets: [],
    detailTargets: []
  }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlHTMLAdvancedConfig
    const { targets } = originalConfig as CrawlHTMLAdvancedConfig

    advancedDetailTargetsConfig = {
      ...advancedDetailTargetsConfig,
      ...(originalConfig as CrawlHTMLAdvancedConfig)
    }

    advancedDetailTargetsConfig.detailTargets =
      transformTargetToDetailTargets(targets)
  } else {
    // string | CrawlHTMLDetailTargetConfig | (string | CrawlHTMLDetailTargetConfig)[]

    advancedDetailTargetsConfig.detailTargets = transformTargetToDetailTargets(
      originalConfig as
        | string
        | CrawlDataDetailTargetConfig
        | (string | CrawlDataDetailTargetConfig)[]
    )
  }

  loaderCommonConfigToCrawlConfig(
    xCrawlInstanceConfig,
    advancedDetailTargetsConfig,
    crawlHTMLConfig
  )

  return crawlHTMLConfig
}

function createCrawlDataConfig<T>(
  xCrawlInstanceConfig: XCrawlInstanceConfig,
  originalConfig: UniteCrawlDataConfig<T>
): CrawlDataConfig {
  const crawlDataConfig: CrawlDataConfig = {
    detailTargets: [],
    intervalTime: undefined,

    selectFingerprintIndexs: [],

    onCrawlItemComplete: undefined
  }

  let advancedDetailTargetsConfig: CrawlDataAdvancedDetailTargetsConfig<T> = {
    targets: [],
    detailTargets: []
  }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlDataAdvancedConfig 处理
    const { targets } = originalConfig as CrawlDataAdvancedConfig<T>

    advancedDetailTargetsConfig =
      originalConfig as CrawlDataAdvancedDetailTargetsConfig<T>

    advancedDetailTargetsConfig.detailTargets =
      transformTargetToDetailTargets(targets)
  } else {
    // string | CrawlDataDetailTargetConfig | (string | CrawlDataDetailTargetConfig)[] 处理
    advancedDetailTargetsConfig.detailTargets = transformTargetToDetailTargets(
      originalConfig as
        | string
        | CrawlDataDetailTargetConfig
        | (string | CrawlDataDetailTargetConfig)[]
    )
  }

  loaderCommonConfigToCrawlConfig(
    xCrawlInstanceConfig,
    advancedDetailTargetsConfig,
    crawlDataConfig
  )

  return crawlDataConfig as CrawlDataConfig
}

function createCrawlFileConfig(
  xCrawlInstanceConfig: XCrawlInstanceConfig,
  originalConfig: UniteCrawlFileConfig
): CrawlFileConfig {
  const crawlFileConfig: CrawlFileConfig = {
    detailTargets: [],
    intervalTime: undefined,

    selectFingerprintIndexs: [],

    onBeforeSaveItemFile: undefined,
    onCrawlItemComplete: undefined
  }

  let advancedDetailTargetsConfig: CrawlFileAdvancedDetailTargetsConfig = {
    targets: [],
    detailTargets: []
  }

  if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
    // CrawlFileAdvancedConfig 处理
    const { targets } = originalConfig as CrawlFileAdvancedConfig

    advancedDetailTargetsConfig =
      originalConfig as CrawlFileAdvancedDetailTargetsConfig

    advancedDetailTargetsConfig.detailTargets =
      transformTargetToDetailTargets(targets)
  } else {
    // CrawlFileDetailTargetConfig |  CrawlFileDetailTargetConfig[] 处理
    advancedDetailTargetsConfig.detailTargets = isArray(originalConfig)
      ? originalConfig
      : [originalConfig as CrawlFileDetailTargetConfig]
  }

  loaderCommonConfigToCrawlConfig(
    xCrawlInstanceConfig,
    advancedDetailTargetsConfig,
    crawlFileConfig
  )

  const advancedStoreDirInfo = {
    exist: !isUndefined(advancedDetailTargetsConfig?.storeDirs),
    type: isString(advancedDetailTargetsConfig?.storeDirs) ? 0 : 1
  }

  const AdvancedExtension = {
    exist: !isUndefined(advancedDetailTargetsConfig?.extensions),
    type: isString(advancedDetailTargetsConfig?.extensions) ? 0 : 1
  }
  const haveAdvancedFileNames = !isUndefined(
    advancedDetailTargetsConfig?.fileNames
  )
  crawlFileConfig.detailTargets.forEach((detail, i) => {
    // 1.storeDir
    if (isUndefined(detail.storeDir) && advancedStoreDirInfo.exist) {
      detail.storeDir =
        advancedStoreDirInfo.type === 0
          ? (advancedDetailTargetsConfig!.storeDirs as string)
          : (advancedDetailTargetsConfig!.storeDirs as (string | null)[])[i]
    }

    // 2.extension
    if (isUndefined(detail.extension) && AdvancedExtension.exist) {
      detail.extension =
        advancedStoreDirInfo.type === 0
          ? (advancedDetailTargetsConfig!.extensions as string)
          : (advancedDetailTargetsConfig!.extensions as (string | null)[])[i]
    }

    // 3.fileName
    if (isUndefined(detail.fileName) && haveAdvancedFileNames) {
      detail.fileName = (
        advancedDetailTargetsConfig!.fileNames as (string | null)[]
      )[i]
    }
  })

  crawlFileConfig.onBeforeSaveItemFile =
    advancedDetailTargetsConfig.onBeforeSaveItemFile

  return crawlFileConfig as CrawlFileConfig
}

/* Single crawl handle */

async function pageSingleCrawlHandle(
  device: Device<LoaderCrawlPageDetail, PageSingleCrawlResult>,
  apiConfig: InfoPageConfig
) {
  const {
    detailTargetConfig,
    detailTargetResult,
    retryCount,
    maxRetry,
    crawlErrorQueue
  } = device
  const { browser } = apiConfig
  const notAllowRetry = retryCount === maxRetry

  // 是否创建过 Page
  const page = detailTargetResult?.page ?? (await browser.newPage())

  if (detailTargetConfig.viewport) {
    await page.setViewport(detailTargetConfig.viewport)
  }

  let response: HTTPResponse | null = null
  let notError = true
  try {
    if (detailTargetConfig.proxyUrl) {
      await browser.createIncognitoBrowserContext({
        proxyServer: detailTargetConfig.proxyUrl
      })
    } else {
      await browser.createIncognitoBrowserContext({
        proxyServer: undefined
      })
    }

    if (detailTargetConfig.cookies) {
      const cookies = parsePageCookies(
        detailTargetConfig.url,
        detailTargetConfig.cookies
      )
      await page.setCookie(...cookies)
    } else {
      const cookies = await page.cookies(detailTargetConfig.url)
      await page.deleteCookie(...cookies)
    }

    if (detailTargetConfig.headers) {
      await page.setExtraHTTPHeaders(detailTargetConfig.headers)
    }

    response = await page.goto(detailTargetConfig.url, {
      timeout: detailTargetConfig.timeout
    })
  } catch (error: any) {
    notError = false
    crawlErrorQueue.push(error)
  }

  // 保存结果
  device.detailTargetResult = { response, page }

  // 处理结果
  const isStatusNormal = !isCrawlStatusInHttpStatus(device)
  const isSuccess = notError && isStatusNormal

  device.isStatusNormal = isStatusNormal
  device.isSuccess = isSuccess
  if (isSuccess || notAllowRetry) {
    device.isHandle = true

    pageSingleResultHandle(device, apiConfig)
  }
}

async function useRequestFnSingleCrawlHandle(
  device: Device<
    LoaderCrawlHTMLDetail | LoaderCrawlDataDetail | LoaderCrawlFileDetail,
    Request
  >,
  apiConfig: InfoHTMLConfig | InfoDataConfig<any> | InfoFileConfig
) {
  const { detailTargetConfig, crawlErrorQueue, maxRetry, retryCount } = device
  const notAllowRetry = maxRetry === retryCount

  let detailTargetResult = null
  let notError = true
  try {
    detailTargetResult = await request(detailTargetConfig)
  } catch (error: any) {
    notError = false
    crawlErrorQueue.push(error)
  }

  // 保存结果
  device.detailTargetResult = detailTargetResult

  // 处理结果
  const isStatusNormal = !isCrawlStatusInHttpStatus(device)
  const isSuccess = notError && isStatusNormal

  device.isStatusNormal = isStatusNormal
  device.isSuccess = isSuccess
  if (isSuccess || notAllowRetry) {
    device.isHandle = true

    if (apiConfig.type === 'html') {
      HTMLSingleResultHandle(device, apiConfig as InfoHTMLConfig)
    } else if (apiConfig.type === 'data') {
      dataSingleResultHandle(device, apiConfig as InfoDataConfig<any>)
    } else if (apiConfig.type === 'file') {
      fileSingleResultHandle(device, apiConfig as InfoFileConfig)
    }
  }
}

/* Single result handle */
const resultEssentialOtherKeys = ['isSuccess', 'retryCount'] as const

function handleResultEssentialOtherValue(device: any) {
  Object.keys(device).forEach((key) => {
    if (resultEssentialOtherKeys.includes(key as any)) {
      device.result[key] = device[key]
    }
  })
}

function pageSingleResultHandle(
  device: Device<LoaderCrawlPageDetail, PageSingleCrawlResult>,
  infoConfig: InfoPageConfig
) {
  const { detailTargetResult, result } = device
  const { browser, onCrawlItemComplete } = infoConfig

  handleResultEssentialOtherValue(device)

  result.data = { browser, ...detailTargetResult }

  if (onCrawlItemComplete) {
    onCrawlItemComplete(device.result as CrawlPageSingleResult)
  }
}

function HTMLSingleResultHandle(
  device: Device<LoaderCrawlHTMLDetail, Request>,
  infoConfig: InfoHTMLConfig
) {
  const { isSuccess, detailTargetResult, result } = device
  const { onCrawlItemComplete } = infoConfig

  handleResultEssentialOtherValue(device)

  if (isSuccess && detailTargetResult) {
    const { data, headers, statusCode } = detailTargetResult
    const html = data.toString()

    result.data = { statusCode, headers, html }
  }

  if (onCrawlItemComplete) {
    onCrawlItemComplete(result as CrawlHTMLSingleResult)
  }
}

function dataSingleResultHandle(
  device: Device<LoaderCrawlDataDetail, Request>,
  infoConfig: InfoDataConfig<any>
) {
  const { isSuccess, detailTargetResult, result } = device
  const { onCrawlItemComplete } = infoConfig

  handleResultEssentialOtherValue(device)

  if (isSuccess && detailTargetResult) {
    const contentType = detailTargetResult.headers['content-type'] ?? ''

    const data = contentType.includes('application/json')
      ? JSON.parse(detailTargetResult.data.toString())
      : contentType.includes('text')
      ? detailTargetResult.data.toString()
      : detailTargetResult.data

    result.data = { ...detailTargetResult, data }
  }

  if (onCrawlItemComplete) {
    onCrawlItemComplete(result as CrawlDataSingleResult<any>)
  }
}

function fileSingleResultHandle(
  device: Device<LoaderCrawlFileDetail, Request>,
  infoConfig: InfoFileConfig
) {
  const { id, isSuccess, detailTargetConfig, detailTargetResult, result } =
    device
  const {
    saveFileErrorArr,
    saveFilePendingQueue,

    onCrawlItemComplete,
    onBeforeSaveItemFile
  } = infoConfig

  handleResultEssentialOtherValue(device)

  if (isSuccess && detailTargetResult) {
    const mimeType = detailTargetResult.headers['content-type'] ?? ''

    const fileName =
      detailTargetConfig.fileName ?? `${id}-${new Date().getTime()}`
    const fileExtension =
      detailTargetConfig.extension ?? `.${mimeType.split('/').pop()}`

    if (
      detailTargetConfig.storeDir &&
      !fs.existsSync(detailTargetConfig.storeDir)
    ) {
      fs.mkdirSync(detailTargetConfig.storeDir, { recursive: true })
    }

    const storePath = detailTargetConfig.storeDir ?? __dirname
    const filePath = path.resolve(storePath, fileName + fileExtension)

    // 在保存前的回调
    const data = detailTargetResult.data
    let dataPromise = Promise.resolve(data)
    if (onBeforeSaveItemFile) {
      dataPromise = onBeforeSaveItemFile({
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
      result.data = {
        ...detailTargetResult,
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
        onCrawlItemComplete(device.result as CrawlFileSingleResult)
      }
    })

    // 存放保存文件 Promise , 后续等待即可回到 crawlFile 函数内部等待完成即可
    saveFilePendingQueue.push(saveFileItemPending)
  } else {
    if (onCrawlItemComplete) {
      onCrawlItemComplete(device.result as CrawlFileSingleResult)
    }
  }
}

/* Create crawl API */

export function createCrawlPage(xCrawlInstanceConfig: XCrawlInstanceConfig) {
  const {
    id: xId,
    mode,
    logConfig,
    crawlPage: crawlPageConfig
  } = xCrawlInstanceConfig

  let id = 0
  let browser: Browser | null = null
  let createBrowserPending: Promise<void> | null = null
  let haveCreateBrowser = false
  const type = 'page'

  function crawlPage(
    config: string,
    callback?: (result: CrawlPageSingleResult) => void
  ): Promise<CrawlPageSingleResult>

  function crawlPage(
    config: CrawlPageDetailTargetConfig,
    callback?: (result: CrawlPageSingleResult) => void
  ): Promise<CrawlPageSingleResult>

  function crawlPage(
    config: (string | CrawlPageDetailTargetConfig)[],
    callback?: (result: CrawlPageSingleResult[]) => void
  ): Promise<CrawlPageSingleResult[]>

  function crawlPage(
    config: CrawlPageAdvancedConfig,
    callback?: (result: CrawlPageSingleResult[]) => void
  ): Promise<CrawlPageSingleResult[]>

  async function crawlPage(
    config: UniteCrawlPageConfig,
    callback?: (result: any) => void
  ): Promise<CrawlPageSingleResult | CrawlPageSingleResult[]> {
    //  创建浏览器
    if (!haveCreateBrowser) {
      haveCreateBrowser = true
      createBrowserPending = puppeteer
        .launch(crawlPageConfig?.puppeteerLaunch)
        .then((result) => {
          browser = result
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
      createCrawlPageConfig(xCrawlInstanceConfig, config)

    const infoConfig: InfoPageConfig = {
      serialNumber: `${xId}-${type}-${++id}`,
      mode,
      type,
      logConfig,
      intervalTime,

      browser: browser!,
      onCrawlItemComplete
    }

    const crawlResultArr = (await controller(
      detailTargets,
      infoConfig,
      pageSingleCrawlHandle
    )) as CrawlPageSingleResult[]

    const crawlResult =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
        ? crawlResultArr
        : crawlResultArr[0]

    if (callback) {
      callback(crawlResult)
    }

    return crawlResult
  }

  return crawlPage
}

export function createCrawlHTML(xCrawlInstanceConfig: XCrawlInstanceConfig) {
  const { id: xId, mode, logConfig } = xCrawlInstanceConfig
  let id = 0
  const type = 'html'

  function crawlHTML(
    config: string,
    callback?: (result: CrawlHTMLSingleResult) => void
  ): Promise<CrawlHTMLSingleResult>

  function crawlHTML(
    config: CrawlHTMLDetailTargetConfig,
    callback?: (result: CrawlHTMLSingleResult) => void
  ): Promise<CrawlHTMLSingleResult>

  function crawlHTML(
    config: (string | CrawlHTMLDetailTargetConfig)[],
    callback?: (result: CrawlHTMLSingleResult[]) => void
  ): Promise<CrawlHTMLSingleResult[]>

  function crawlHTML(
    config: CrawlHTMLAdvancedConfig,
    callback?: (result: CrawlHTMLSingleResult[]) => void
  ): Promise<CrawlHTMLSingleResult[]>

  async function crawlHTML(
    config: UniteCrawlHTMLConfig,
    callback?: (result: any) => void
  ): Promise<CrawlHTMLSingleResult | CrawlHTMLSingleResult[]> {
    const { detailTargets, intervalTime, onCrawlItemComplete } =
      createCrawlHTMLConfig(xCrawlInstanceConfig, config)

    const infoConfig: InfoHTMLConfig = {
      serialNumber: `${xId}-${type}-${++id}`,
      mode,
      type,
      logConfig,
      intervalTime,

      onCrawlItemComplete
    }

    const crawlResultArr = (await controller(
      detailTargets,
      infoConfig,
      useRequestFnSingleCrawlHandle
    )) as CrawlHTMLSingleResult[]

    const crawlResult =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
        ? crawlResultArr
        : crawlResultArr[0]

    if (callback) {
      callback(crawlResult)
    }

    return crawlResult
  }

  return crawlHTML
}

export function createCrawlData(xCrawlInstanceConfig: XCrawlInstanceConfig) {
  const { id: xId, mode, logConfig } = xCrawlInstanceConfig
  let id = 0
  const type = 'data'

  function crawlData<T = any>(
    config: string,
    callback?: (result: CrawlDataSingleResult<T>) => void
  ): Promise<CrawlDataSingleResult<T>>

  function crawlData<T = any>(
    config: CrawlDataDetailTargetConfig,
    callback?: (result: CrawlDataSingleResult<T>) => void
  ): Promise<CrawlDataSingleResult<T>>

  function crawlData<T = any>(
    config: (string | CrawlDataDetailTargetConfig)[],
    callback?: (result: CrawlDataSingleResult<T>[]) => void
  ): Promise<CrawlDataSingleResult<T>[]>

  function crawlData<T = any>(
    config: CrawlDataAdvancedConfig<T>,
    callback?: (result: CrawlDataSingleResult<T>[]) => void
  ): Promise<CrawlDataSingleResult<T>[]>

  async function crawlData<T = any>(
    config: UniteCrawlDataConfig<T>,
    callback?: (result: any) => void
  ): Promise<CrawlDataSingleResult<T> | CrawlDataSingleResult<T>[]> {
    const { detailTargets, intervalTime, onCrawlItemComplete } =
      createCrawlDataConfig(xCrawlInstanceConfig, config)

    const infoConfig: InfoDataConfig<T> = {
      serialNumber: `${xId}-${type}-${++id}`,
      mode,
      type,
      logConfig,
      intervalTime,

      onCrawlItemComplete
    }

    const crawlResultArr = (await controller(
      detailTargets,
      infoConfig,
      useRequestFnSingleCrawlHandle
    )) as CrawlDataSingleResult<T>[]

    const crawlResult =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
        ? crawlResultArr
        : crawlResultArr[0]

    if (callback) {
      callback(crawlResult)
    }

    return crawlResult
  }

  return crawlData
}

export function createCrawlFile(xCrawlInstanceConfig: XCrawlInstanceConfig) {
  const { id: xId, mode, logConfig } = xCrawlInstanceConfig
  let id = 0
  const type = 'file'

  function crawlFile(
    config: CrawlFileDetailTargetConfig,
    callback?: (result: CrawlFileSingleResult) => void
  ): Promise<CrawlFileSingleResult>

  function crawlFile(
    config: CrawlFileDetailTargetConfig[],
    callback?: (result: CrawlFileSingleResult[]) => void
  ): Promise<CrawlFileSingleResult[]>

  function crawlFile(
    config: CrawlFileAdvancedConfig,
    callback?: (result: CrawlFileSingleResult[]) => void
  ): Promise<CrawlFileSingleResult[]>

  async function crawlFile(
    config: UniteCrawlFileConfig,
    callback?: (result: any) => void
  ): Promise<CrawlFileSingleResult | CrawlFileSingleResult[]> {
    const {
      detailTargets,
      intervalTime,
      onBeforeSaveItemFile,
      onCrawlItemComplete
    } = createCrawlFileConfig(xCrawlInstanceConfig, config)

    const infoConfig: InfoFileConfig = {
      serialNumber: `${xId}-${type}-${++id}`,
      mode,
      type,
      logConfig,
      intervalTime,

      saveFileErrorArr: [],
      saveFilePendingQueue: [],

      onCrawlItemComplete,
      onBeforeSaveItemFile
    }

    const crawlResultArr = (await controller(
      detailTargets,
      infoConfig,
      useRequestFnSingleCrawlHandle
    )) as CrawlFileSingleResult[]

    const { saveFilePendingQueue, saveFileErrorArr } = infoConfig

    // 等待保存文件完成
    await Promise.all(saveFilePendingQueue)

    if (logConfig.result) {
      // 打印保存错误
      quickSort(saveFileErrorArr).forEach((item) =>
        log(`${infoConfig.serialNumber} | ${logError(item.message)}`)
      )

      // 统计保存
      const succssIds: number[] = []
      const errorIds: number[] = []
      crawlResultArr.forEach((item) => {
        if (item.data?.data.isSuccess) {
          succssIds.push(item.id)
        } else {
          errorIds.push(item.id)
        }
      })

      log(`${whiteBold(infoConfig.serialNumber)} | ${logStatistics(
        'Save finish:'
      )}
             ${logSuccess(
               `Success - total: ${
                 succssIds.length
               }, targets id: [ ${succssIds.join(', ')} ]`
             )}
               ${logError(
                 `Error - total: ${
                   errorIds.length
                 }, targets id: [ ${errorIds.join(', ')} ]`
               )}
        `)
    }

    const crawlResult =
      isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
        ? crawlResultArr
        : crawlResultArr[0]

    if (callback) {
      callback(crawlResult)
    }

    return crawlResult
  }

  return crawlFile
}

export function createStartPolling(xCrawlInstanceConfig: XCrawlInstanceConfig) {
  const { id: xId, logConfig } = xCrawlInstanceConfig
  let id = 0
  const type = 'polling'

  return (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => {
    const serialNumber = `${xId}-${type}-${++id}`
    const { d, h, m } = config

    const day = !isUndefined(d) ? d * 1000 * 60 * 60 * 24 : 0
    const hour = !isUndefined(h) ? h * 1000 * 60 * 60 : 0
    const minute = !isUndefined(m) ? m * 1000 * 60 : 0
    const total = day + hour + minute

    let count = 0

    startCallback()
    const intervalId = setInterval(startCallback, total)

    function startCallback() {
      if (logConfig.start) {
        log(
          `${whiteBold(serialNumber)} | ${logStart(
            `Start polling - count: ${++count}`
          )}`
        )
      }

      callback(count, stopPolling)
    }

    function stopPolling() {
      clearInterval(intervalId)

      if (logConfig.result) {
        log(`${whiteBold(serialNumber)} | ${logWarn('Stop the polling')}`)
      }
    }
  }
}
