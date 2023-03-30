import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol } from 'puppeteer'

import { RequestConfig } from './request'
import { AnyObject, MapTypeObject } from './common'

/* Merge Config */

export interface MergeCrawlPageConfig
  extends MapTypeObject<CrawlPageConfigObject, 'requestConfig'> {
  requestConfig: RequestPageConfig[]
}

export type MergeCrawlRequestConfig<T extends CrawlRequestCommonConfig> =
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
  requestConfig: string | string[] | RequestPageConfig | RequestPageConfig[]
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

export interface CrawlRequestCommonConfig {
  requestConfig: string | string[] | RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
  maxRetry?: number
}

export interface CrawlDataConfig extends CrawlRequestCommonConfig {}

export interface CrawlFileConfig extends CrawlRequestCommonConfig {
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
    response: HTTPResponse | null
    browser: Browser
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
