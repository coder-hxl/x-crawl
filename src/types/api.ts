import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { RequestConfig } from './request'
import { AnyObject, MapTypeObject } from './common'

/* Merge Config */

export interface MergeCrawlPageConfig
  extends MapTypeObject<CrawlPageConfigObject, 'requestConfig'> {
  requestConfig: RequestPageConfig[]
}

export type MergeCrawlRequestConfig<T extends CrawlRequestCommonConfig<any>> =
  MapTypeObject<T, 'requestConfig'> & {
    requestConfig: RequestConfig[]
  }

/* API Config */
export type IntervalTime = number | { max: number; min?: number }

export type RequestPageCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]

export interface RequestPageConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  cookies?: RequestPageCookies
  maxRetry?: number
}

export interface CrawlPageConfigObject {
  requestConfig: string[] | RequestPageConfig[]
  cookies?: RequestPageCookies
  intervalTime?: IntervalTime
  maxRetry?: number
}

export type CrawlPageConfig =
  | string
  | string[]
  | RequestPageConfig
  | RequestPageConfig[]
  | CrawlPageConfigObject

export type CrawlRequestConfig =
  | string
  | string[]
  | RequestConfig
  | RequestConfig[]

export interface CrawlRequestCommonConfig<R extends CrawlRequestConfig> {
  requestConfig: R
  intervalTime?: IntervalTime
  maxRetry?: number
}

export interface CrawlDataConfig<R extends CrawlRequestConfig>
  extends CrawlRequestCommonConfig<R> {}

export interface CrawlFileConfig<R extends CrawlRequestConfig>
  extends CrawlRequestCommonConfig<R> {
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
  retryCount: number
  errorQueue: Error[]
}

export interface CrawlPageRes extends CrawlCommonRes {
  data: {
    browser: Browser
    response: HTTPResponse | null
    page: Page
  }
}

export interface CrawlRequestCommonRes<T> extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: T
  } | null
}

export interface FileInfo {
  isSuccess: boolean
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
