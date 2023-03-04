import { IncomingHttpHeaders } from 'node:http'
import { HTTPResponse, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'

import { RequestConfigObject } from './request'
import { AnyObject, MapTypeObject } from './common'

export type IntervalTime = number | { max: number; min?: number }

export type RequestConfig = string | RequestConfigObject

export interface MergeRequestConfigObject {
  url: string
  timeout?: number
  proxy?: string
}

type MergeRequestConfig = string | MergeRequestConfigObject

export type MergeConfigRawConfig = {
  requestConfig: MergeRequestConfig | MergeRequestConfig[]
  intervalTime?: IntervalTime
}

export type MergeConfigV1<T extends AnyObject> = MapTypeObject<
  T,
  'requestConfig'
> & {
  requestConfig: RequestConfigObject[]
  intervalTime?: IntervalTime
}

export type MergeConfigV2 = {
  requestConfig: MergeRequestConfigObject[]
  intervalTime?: IntervalTime
}

export interface CrawlBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}

export type CrawlPageConfig = string | MergeRequestConfigObject

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

export interface CrawlResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: T
}

export type CrawlResCommonArrV1<T> = CrawlResCommonV1<T>[]

export interface FileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}

export interface CrawlPage {
  httpResponse: HTTPResponse | null
  data: {
    page: Page
    jsdom: JSDOM
  }
}
