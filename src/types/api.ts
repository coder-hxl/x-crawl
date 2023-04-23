import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol, Viewport } from 'puppeteer'

import { AnyObject } from './common'
import { ProxyDetails } from '../api'

/* API Config */

// API crawl config

// API crawl config other
export type IntervalTime = number | { max: number; min?: number }

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type PageCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]

export type Platform =
  | 'Android'
  | 'Chrome OS'
  | 'Chromium OS'
  | 'iOS'
  | 'Linux'
  | 'macOS'
  | 'Windows'
  | 'Unknown'

export interface DetailTargetFingerprintCommon {
  ua?: string
  mobile?: '?0' | '?1' | 'random'
  platform?: Platform
  platformVersion?: string
  acceptLanguage?: string
  userAgent?: {
    value: string
    versions?: {
      name: string
      maxMajorVersion?: number
      minMajorVersion?: number
      maxMinorVersion?: number
      minMinorVersion?: number
      maxPatchVersion?: number
      minPatchVersion?: number
    }[]
  }
}

export interface CrawlCommonConfig {
  timeout?: number
  proxy?: {
    urls: string[]
    switchByHttpStatus?: number[]
    switchByErrorCount?: number
  }
  maxRetry?: number
}

// 1.Detail target
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null
  fingerprint?:
    | (DetailTargetFingerprintCommon & {
        maxWidth?: number
        minWidth?: number
        maxHeight?: number
        minHidth?: number
      })
    | null
}

export interface CrawlDataDetailTargetConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: AnyObject | null
  params?: AnyObject
  data?: any
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}

export interface CrawlFileDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  priority?: number
  storeDir?: string | null
  fileName?: string
  extension?: string | null
  fingerprint?: DetailTargetFingerprintCommon | null
}

// 2.Advanced
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: (DetailTargetFingerprintCommon & {
    maxWidth?: number
    minWidth?: number
    maxHeight?: number
    minHidth?: number
  })[]

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: Viewport

  onCrawlItemComplete?: (crawlPageSingleRes: CrawlPageSingleRes) => void
}

export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: AnyObject

  onCrawlItemComplete?: (crawlDataSingleRes: CrawlDataSingleRes<T>) => void
}

export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: AnyObject
  storeDir?: string
  extension?: string

  onCrawlItemComplete?: (crawlFileSingleRes: CrawlFileSingleRes) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
}

export interface StartPollingConfig {
  d?: number
  h?: number
  m?: number
}

/* API Result */
export interface CrawlCommonRes {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  crawlErrorQueue: Error[]
  proxyDetailes: ProxyDetails
}

export interface CrawlPageSingleRes extends CrawlCommonRes {
  data: {
    browser: Browser
    response: HTTPResponse | null
    page: Page
  }
}

export interface CrawlDataSingleRes<D> extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: D
  } | null
}

export interface CrawlFileSingleRes extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: {
      isSuccess: boolean
      fileName: string
      fileExtension: string
      mimeType: string
      size: number
      filePath: string
    }
  } | null
}
