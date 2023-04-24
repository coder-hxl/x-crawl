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
  IntervalTime,
  DetailTargetFingerprintCommon
} from './types/api'
import { LoaderXCrawlConfig } from './types'
import { fingerprints } from './default'

/* Types */

// Extra config
export interface ExtraCommonConfig {
  intervalTime: IntervalTime | undefined
}

export interface ExtraDataAndFileCommonConfig {
  type: 'data' | 'file'
}

interface ExtraPageConfig extends ExtraCommonConfig {
  browser: Browser
  onCrawlItemComplete:
    | ((crawlPageSingleRes: CrawlPageSingleRes) => void)
    | undefined
}

interface ExtraDataConfig<T>
  extends ExtraCommonConfig,
    ExtraDataAndFileCommonConfig {
  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<T>) => void)
    | undefined
}

interface ExtraFileConfig
  extends ExtraCommonConfig,
    ExtraDataAndFileCommonConfig {
  saveFileErrorArr: { message: string; valueOf: () => number }[]
  saveFilePendingQueue: Promise<any>[]
  onCrawlItemComplete:
    | ((crawlFileSingleRes: CrawlFileSingleRes) => void)
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
  timeout: number
  maxRetry: number
  priority: number
}

export type LoaderCrawlPageDetail = LoaderCommonConfig &
  LoaderHasConfig &
  CrawlPageDetailTargetConfig

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
    | ((crawlPageSingleRes: CrawlPageSingleRes) => void)
    | undefined
}

interface CrawlDataConfig {
  detailTargets: LoaderCrawlDataDetail[]
  intervalTime: IntervalTime | undefined

  selectFingerprintIndexs: number[]

  onCrawlItemComplete:
    | ((crawlDataSingleRes: CrawlDataSingleRes<any>) => void)
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
    | ((crawlDataSingleRes: CrawlDataSingleRes<any>) => void)
    | undefined
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
  xCrawlConfig: LoaderXCrawlConfig,
  advancedDetailTargetsConfig:
    | CrawlPageAdvancedDetailTargetsConfig
    | CrawlDataAdvancedDetailTargetsConfig<any>
    | CrawlFileAdvancedDetailTargetsConfig,
  crawlConfig: CrawlPageConfig | CrawlDataConfig | CrawlFileConfig
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
      if (!isUndefined(xCrawlConfig.baseUrl)) {
        detail.url = xCrawlConfig.baseUrl + url
      }

      // 1.2.timeout
      if (isUndefined(timeout)) {
        if (!isUndefined(advancedDetailTargetsConfig.timeout)) {
          detail.timeout = advancedDetailTargetsConfig.timeout
        } else {
          detail.timeout = xCrawlConfig.timeout
        }
      }

      // 1.3.maxRetry
      if (isUndefined(maxRetry)) {
        if (!isUndefined(advancedDetailTargetsConfig.maxRetry)) {
          detail.maxRetry = advancedDetailTargetsConfig.maxRetry
        } else {
          detail.maxRetry = xCrawlConfig.maxRetry
        }
      }

      // 1.4.proxy
      if (isUndefined(proxy)) {
        if (!isUndefined(advancedDetailTargetsConfig.proxy)) {
          detail.proxy = advancedDetailTargetsConfig.proxy
        } else if (!isUndefined(xCrawlConfig.proxy)) {
          detail.proxy = xCrawlConfig.proxy
        }
      }

      // 1.5.proxyUrl & proxyDetail
      if (!isUndefined(detail.proxy?.urls)) {
        const urls = detail.proxy!.urls
        detail.proxyUrl = urls[0]
        detail.proxyDetails = urls.map((url) => ({ url, state: true }))
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
        xCrawlConfig.enableRandomFingerprint
      ) {
        // xCrawlConfig
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
    !isUndefined(xCrawlConfig.intervalTime)
  ) {
    crawlConfig.intervalTime = xCrawlConfig.intervalTime
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
  xCrawlConfig: LoaderXCrawlConfig,
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
    xCrawlConfig,
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

function createCrawlDataConfig<T>(
  xCrawlConfig: LoaderXCrawlConfig,
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
    xCrawlConfig,
    advancedDetailTargetsConfig,
    crawlDataConfig
  )

  return crawlDataConfig as CrawlDataConfig
}

function createCrawlFileConfig(
  xCrawlConfig: LoaderXCrawlConfig,
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
    xCrawlConfig,
    advancedDetailTargetsConfig,
    crawlFileConfig
  )

  const haveAdvancedStoreDir = !isUndefined(
    advancedDetailTargetsConfig?.storeDir
  )
  const haveAdvancedExtension = !isUndefined(
    advancedDetailTargetsConfig?.extension
  )
  crawlFileConfig.detailTargets.forEach((detail) => {
    // 1.storeDir
    if (isUndefined(detail.storeDir) && haveAdvancedStoreDir) {
      detail.storeDir = advancedDetailTargetsConfig!.storeDir
    }

    // 2.extension
    if (isUndefined(detail.extension) && haveAdvancedExtension) {
      detail.extension = advancedDetailTargetsConfig!.extension
    }
  })

  crawlFileConfig.onBeforeSaveItemFile =
    advancedDetailTargetsConfig.onBeforeSaveItemFile

  return crawlFileConfig as CrawlFileConfig
}

/* Single crawl handle */

async function pageSingleCrawlHandle(
  device: Device<LoaderCrawlPageDetail, PageSingleCrawlResult>,
  extraConfig: ExtraPageConfig
): Promise<PageSingleCrawlResult> {
  const {
    detailTargetConfig,
    detailTargetResult,
    retryCount,
    maxRetry,
    crawlErrorQueue
  } = device
  const { browser } = extraConfig
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

    pageSingleResultHandle(device, extraConfig)
  }

  return { response, page }
}

async function dataAndFileSingleCrawlHandle(
  device: Device<LoaderCrawlDataDetail | LoaderCrawlFileDetail, Request>,
  extraConfig: ExtraDataConfig<any> | ExtraFileConfig
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

    if (extraConfig.type === 'data') {
      dataSingleResultHandle(device, extraConfig as ExtraDataConfig<any>)
    } else if (extraConfig.type === 'file') {
      fileSingleResultHandle(device, extraConfig as ExtraFileConfig)
    }
  }

  return await request(detailTargetConfig)
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
  extraConfig: ExtraPageConfig
) {
  const { detailTargetResult, result } = device
  const { browser, onCrawlItemComplete } = extraConfig

  handleResultEssentialOtherValue(device)

  result.data = { browser, ...detailTargetResult }

  if (onCrawlItemComplete) {
    onCrawlItemComplete(device.result as CrawlPageSingleRes)
  }
}

function dataSingleResultHandle(
  device: Device<LoaderCrawlDataDetail, Request>,
  extraConfig: ExtraDataConfig<any>
) {
  const { isSuccess, detailTargetResult, result } = device
  const { onCrawlItemComplete } = extraConfig

  handleResultEssentialOtherValue(device)

  if (isSuccess && detailTargetResult) {
    const contentType = detailTargetResult.headers['content-type'] ?? ''

    const data =
      contentType === 'application/json'
        ? JSON.parse(detailTargetResult.data.toString())
        : contentType.includes('text')
        ? detailTargetResult.data.toString()
        : detailTargetResult.data

    result.data = { ...detailTargetResult, data }
  }

  if (onCrawlItemComplete) {
    onCrawlItemComplete(result as CrawlDataSingleRes<any>)
  }
}

function fileSingleResultHandle(
  device: Device<LoaderCrawlFileDetail, Request>,
  extraConfig: ExtraFileConfig
) {
  const { id, isSuccess, detailTargetConfig, detailTargetResult, result } =
    device
  const {
    saveFileErrorArr,
    saveFilePendingQueue,

    onCrawlItemComplete,
    onBeforeSaveItemFile
  } = extraConfig

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
      mkdirDirSync(detailTargetConfig.storeDir)
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
        onCrawlItemComplete(device.result as CrawlFileSingleRes)
      }
    })

    // 存放保存文件 Promise , 后续等待即可回到 crawlFile 函数内部等待完成即可
    saveFilePendingQueue.push(saveFileItemPending)
  } else {
    if (onCrawlItemComplete) {
      onCrawlItemComplete(device.result as CrawlFileSingleRes)
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
      browser: browser!,
      intervalTime,
      onCrawlItemComplete
    }

    const crawlResArr = (await controller(
      'page',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      pageSingleCrawlHandle
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

    const extraConfig: ExtraDataConfig<T> = {
      type: 'data',
      intervalTime,
      onCrawlItemComplete
    }

    const crawlResArr = (await controller(
      'data',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      dataAndFileSingleCrawlHandle
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
      onBeforeSaveItemFile,
      onCrawlItemComplete
    } = createCrawlFileConfig(xCrawlConfig, config)

    const extraConfig: ExtraFileConfig = {
      type: 'file',

      saveFileErrorArr: [],
      saveFilePendingQueue: [],

      intervalTime,
      onCrawlItemComplete,
      onBeforeSaveItemFile
    }

    const crawlResArr = (await controller(
      'file',
      xCrawlConfig.mode,
      detailTargets,
      extraConfig,
      dataAndFileSingleCrawlHandle
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
