import { IncomingHttpHeaders } from 'node:http'
import { HTTPResponse, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'

import { RequestConfig } from './request'

export type IntervalTime = number | { max: number; min?: number }

export interface FetchBaseConifgV1 {
  requestConifg: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}

export interface FetchBaseConifgV2 {
  url: string
  timeout?: number
  proxy?: string
}

export type FetchHTMLConfig = string | FetchBaseConifgV2

export interface FetchDataConfig extends FetchBaseConifgV1 {}

export interface FetchFileConfig extends FetchBaseConifgV1 {
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

export interface FetchHTML {
  httpResponse: HTTPResponse | null
  data: {
    page: Page
    jsdom: JSDOM
  }
}
