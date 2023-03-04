import { IncomingHttpHeaders } from 'node:http'
import { HTTPResponse, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'

import { RequestBaseConfig, RequestConfig } from './request'

export type IntervalTime = number | { max: number; min?: number }

export type MergeConfigRawConfig = {
  requestConfig: RequestBaseConfig | RequestBaseConfig[]
  intervalTime?: IntervalTime
}

export interface CrawlBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}

export type CrawlPageConfig = string | RequestBaseConfig

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
