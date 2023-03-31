import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page } from 'puppeteer'

import { MapTypeObject } from './common'
import {
  DataRequestConfig,
  FileRequestConfig,
  PageRequestConfig,
  PageRequestConfigCookies
} from './request'

/* Merge Config */
export interface MergeCrawlPageConfig
  extends MapTypeObject<CrawlPageConfigObject, 'requestConfigs'> {
  requestConfigs: PageRequestConfig[]
}

export interface MergeCrawlDataConfig
  extends MapTypeObject<CrawlDataConfigObject, 'requestConfigs'> {
  requestConfigs: DataRequestConfig[]
}

export interface MergeCrawlFileConfig
  extends MapTypeObject<
    CrawlFileConfig<CrawlFileRequestConfig>,
    'requestConfig'
  > {
  requestConfigs: FileRequestConfig[]
}

/* API Config */
export type IntervalTime = number | { max: number; min?: number }

export type CrawlFileRequestConfig =
  | string
  | string[]
  | FileRequestConfig
  | FileRequestConfig[]

export interface CrawlPageConfigObject {
  requestConfigs: string[] | PageRequestConfig[]
  cookies?: PageRequestConfigCookies
  intervalTime?: IntervalTime
  maxRetry?: number
}

export interface CrawlDataConfigObject {
  requestConfigs: string[] | DataRequestConfig[]
  intervalTime?: IntervalTime
  maxRetry?: number
}

export type CrawlPageConfig =
  | string
  | string[]
  | PageRequestConfig
  | PageRequestConfig[]
  | CrawlPageConfigObject

export type CrawlDataConfig =
  | string
  | string[]
  | DataRequestConfig
  | DataRequestConfig[]
  | CrawlDataConfigObject

export interface CrawlFileConfig<R extends CrawlFileRequestConfig> {
  requestConfig: R
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
  | string[]
  | PageRequestConfig[]
  | CrawlPageConfigObject
  ? CrawlPageSingleRes[]
  : CrawlPageSingleRes

export type CrawlDataRes<D, R extends CrawlDataConfig> = R extends
  | string[]
  | DataRequestConfig[]
  | CrawlDataConfigObject
  ? CrawlDataSingleRes<D>[]
  : CrawlDataSingleRes<D>

export type CrawlFileRes<R extends CrawlFileRequestConfig> = R extends
  | string[]
  | PageRequestConfig[]
  ? CrawlFileSingleRes[]
  : CrawlFileSingleRes
