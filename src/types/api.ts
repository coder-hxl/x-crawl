import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { AnyObject, MapTypeObject } from './common'

/* Loader Config */
type LoaderHasConfig = {
  timeout: number
  maxRetry: number
  priority: number
}

export type LoaderPageRequestConfig = PageRequestConfig & LoaderHasConfig

export type LoaderDataRequestConfig = DataRequestConfig & LoaderHasConfig

export type LoaderFileRequestConfig = FileRequestConfig & LoaderHasConfig

export interface LoaderCrawlPageConfig
  extends MapTypeObject<CrawlPageConfigObject, 'requestConfigs'> {
  requestConfigs: LoaderPageRequestConfig[]
}

export interface LoaderCrawlDataConfig
  extends MapTypeObject<CrawlDataConfigObject, 'requestConfigs'> {
  requestConfigs: LoaderDataRequestConfig[]
}

export interface LoaderCrawlFileConfig
  extends MapTypeObject<
    CrawlFileConfig<CrawlFileRequestConfig>,
    'requestConfig'
  > {
  requestConfigs: LoaderFileRequestConfig[]
}

/* API Config */
export type IntervalTime = number | { max: number; min?: number }

// RequestConfig
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

export type PageRequestConfigCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]

export interface PageRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  cookies?: PageRequestConfigCookies
  maxRetry?: number
  priority?: number
}

export interface DataRequestConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
  maxRetry?: number
  priority?: number
}

export interface FileRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  maxRetry?: number
  priority?: number
}

// CrawlConfig
export type CrawlFileRequestConfig =
  | string
  | FileRequestConfig
  | (string | FileRequestConfig)[]

export interface CrawlPageConfigObject {
  requestConfigs: (string | PageRequestConfig)[]
  timeout?: number
  cookies?: PageRequestConfigCookies
  intervalTime?: IntervalTime
  maxRetry?: number
}

export interface CrawlDataConfigObject {
  requestConfigs: (string | DataRequestConfig)[]
  timeout?: number
  intervalTime?: IntervalTime
  maxRetry?: number
}

export type CrawlPageConfig =
  | string
  | PageRequestConfig
  | (string | PageRequestConfig)[]
  | CrawlPageConfigObject

export type CrawlDataConfig =
  | string
  | DataRequestConfig
  | (string | DataRequestConfig)[]
  | CrawlDataConfigObject

export interface CrawlFileConfig<R extends CrawlFileRequestConfig> {
  requestConfig: R
  timeout?: number
  intervalTime?: IntervalTime
  maxRetry?: number
  fileConfig: {
    storeDir: string
    extension?: string
  }
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
      mimeType: string
      size: number
      filePath: string
    }
  } | null
}

export type CrawlPageRes<R extends CrawlPageConfig> = R extends
  | (string | PageRequestConfig)[]
  | CrawlPageConfigObject
  ? CrawlPageSingleRes[]
  : CrawlPageSingleRes

export type CrawlDataRes<D, R extends CrawlDataConfig> = R extends
  | (string | DataRequestConfig)[]
  | CrawlDataConfigObject
  ? CrawlDataSingleRes<D>[]
  : CrawlDataSingleRes<D>

export type CrawlFileRes<R extends CrawlFileRequestConfig> = R extends
  | (string | PageRequestConfig)[]
  ? CrawlFileSingleRes[]
  : CrawlFileSingleRes
