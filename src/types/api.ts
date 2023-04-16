import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { AnyObject } from './common'

/* Loader Config */
type LoaderHasConfig = {
  timeout: number
  maxRetry: number
  priority: number
}

export type LoaderCrawlPageDetail = CrawlPageDetailConfig & LoaderHasConfig

export type LoaderCrawlDataDetail = CrawlDataDetailConfig & LoaderHasConfig

export type LoaderCrawlFileDetail = CrawlFileDetailConfig & LoaderHasConfig

export interface LoaderCrawlPageConfig
  extends Omit<CrawlPageEnhanceConfig, 'crawlPages'> {
  crawlPageDetails: LoaderCrawlPageDetail[]
}

export interface LoaderCrawlDataConfig
  extends Omit<CrawlDataEnhanceConfig, 'crawlDatas'> {
  crawlDataDetails: LoaderCrawlDataDetail[]
}

export interface LoaderCrawlFileConfig
  extends Omit<CrawlFileEnhanceConfig, 'crawlFiles'> {
  crawlFileDetails: LoaderCrawlFileDetail[]
}

/* Function overloading crawl config */
export type UniteCrawlPageConfig =
  | string
  | CrawlPageDetailConfig
  | (string | CrawlPageDetailConfig)[]
  | CrawlPageEnhanceConfig

export type UniteCrawlDataConfig =
  | string
  | CrawlDataDetailConfig
  | (string | CrawlDataDetailConfig)[]
  | CrawlDataEnhanceConfig

export type UniteCrawlFileConfig =
  | CrawlFileDetailConfig
  | CrawlFileDetailConfig[]
  | CrawlFileEnhanceConfig

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

// 1.Crawl page config
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

export interface CrawlPageEnhanceConfig extends CrawlCommonConfig {
  crawlPages: (string | CrawlPageDetailConfig)[]
  intervalTime?: IntervalTime

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: {
    width?: number
    height?: number
  }
}

// 2.Crawl data config
export interface CrawlDataDetailConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  priority?: number
}

export interface CrawlDataEnhanceConfig extends CrawlCommonConfig {
  crawlDatas: (string | CrawlDataDetailConfig)[]
  intervalTime?: IntervalTime

  headers?: AnyObject
}

// 3.Crawl file config
export interface CrawlFileDetailConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject
  priority?: number
  storeDir?: string
  fileName?: string
  extension?: string
}

export interface CrawlFileEnhanceConfig extends CrawlCommonConfig {
  crawlFiles: (string | CrawlFileDetailConfig)[]
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
}

// 4.Polling config
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
  crawlCount: number
  retryCount: number
  errorQueue: Error[]
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
