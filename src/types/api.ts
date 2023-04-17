import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { AnyObject } from './common'

/* API Config */

// API Config Other
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

// API crawl config
// Common
export interface CrawlCommonConfig {
  timeout?: number
  proxy?: string
  maxRetry?: number
}

// 1.Detail
export interface CrawlPageDetailConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject
  cookies?: PageCookies
  priority?: number
  viewport?: {
    width?: number
    height?: number
  }
}

export interface CrawlDataDetailConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  priority?: number
}

export interface CrawlFileDetailConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject
  priority?: number
  storeDir?: string
  fileName?: string
  extension?: string
}

// 2.Advanced
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailConfig)[]
  intervalTime?: IntervalTime

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: {
    width?: number
    height?: number
  }

  onCrawlItemComplete?: (crawlPageSingleRes: CrawlPageSingleRes) => void
}

export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailConfig)[]
  intervalTime?: IntervalTime

  headers?: AnyObject

  onCrawlItemComplete?: (crawlDataSingleRes: CrawlDataSingleRes<T>) => void
}

export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailConfig)[]
  intervalTime?: IntervalTime

  headers?: AnyObject
  storeDir?: string
  extension?: string

  onBeforeSaveFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
  onCrawlItemComplete?: (crawlFileSingleRes: CrawlFileSingleRes) => void
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
