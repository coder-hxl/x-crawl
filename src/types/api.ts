import { IncomingHttpHeaders } from 'node:http'
import { HTTPResponse, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'

import { RequestBaseConfig, RequestConfig } from './request'

export type IntervalTime = number | { max: number; min?: number }

export type MergeConfigRawConfig = {
  requestConfig: RequestBaseConfig | RequestBaseConfig[]
  intervalTime?: IntervalTime
}

export interface FetchBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}

export type FetchPageConfig = string | RequestBaseConfig

export interface FetchDataConfig extends FetchBaseConfigV1 {}

export interface FetchFileConfig extends FetchBaseConfigV1 {
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

export interface FetchResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: T
}

export type FetchResCommonArrV1<T> = FetchResCommonV1<T>[]

export interface FileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}

export interface FetchPage {
  httpResponse: HTTPResponse | null
  data: {
    page: Page
    jsdom: JSDOM
  }
}
