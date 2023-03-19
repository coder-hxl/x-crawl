import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'

import { RequestConfigObjectV1, RequestConfigObjectV2 } from './request'
import { AnyObject, MapTypeObject } from './common'

export type IntervalTime = number | { max: number; min?: number }

export type RequestConfig = string | RequestConfigObjectV2

type MergeRequestConfig =
  | string
  | {
      url: string
      timeout?: number
      proxy?: string
    }

export type MergeConfigRawConfig = {
  requestConfig: MergeRequestConfig | MergeRequestConfig[]
  intervalTime?: IntervalTime
}

export type MergeConfigV1 = {
  requestConfig: RequestConfigObjectV1[]
  intervalTime?: IntervalTime
}

export type MergeConfigV2<T extends AnyObject> = MapTypeObject<
  T,
  'requestConfig'
> & {
  requestConfig: RequestConfigObjectV2[]
  intervalTime?: IntervalTime
}

/* API Config */
export type CrawlPageConfig = string | RequestConfigObjectV1

export interface CrawlBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}

export interface CrawlDataConfig extends CrawlBaseConfigV1 {}

export interface CrawlFileConfig extends CrawlBaseConfigV1 {
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
export interface CrawlResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: T
}

export type CrawlResCommonArrV1<T> = CrawlResCommonV1<T>[]

export interface CrawlPage {
  httpResponse: HTTPResponse | null
  browser: Browser
  page: Page
  jsdom: JSDOM
}

export interface FileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
