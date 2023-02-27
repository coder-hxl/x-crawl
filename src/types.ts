import { IncomingHttpHeaders } from 'node:http'
import { JSDOM } from 'jsdom'
import { HTTPResponse } from 'puppeteer'

export interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}

export type IMapTypeObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]: T[P]
}

export type IMapTypeEmptyObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]?: T[P]
}

export interface IRequest {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: Buffer
}

export interface IRequestResItem extends IRequest {
  id: number
}

export type IMethod =
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

export interface IRequestConfig {
  url: string
  method?: IMethod
  headers?: IAnyObject
  params?: IAnyObject
  data?: any
  timeout?: number
  proxy?: string
}

export type IIntervalTime = number | { max: number; min?: number }

export interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}

export interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}

export type IFetchHTMLConfig =
  | string
  | {
      url: string
      header?: IAnyObject
      timeout?: number
      proxy?: string
    }

export interface IFetchDataConfig extends IFetchBaseConifg {}

export interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
    extension?: string
  }
}

export interface IStartPollingConfig {
  Y?: number
  M?: number
  d?: number
  h?: number
  m?: number
}

export interface IFetchCommon<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: T
}

export type IFetchCommonArr<T> = IFetchCommon<T>[]

export interface IFileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}

export interface IFetchHTML {
  httpResponse: HTTPResponse | null
  data: {
    content: string
    jsdom: JSDOM
  }
}

export interface IXCrawlInstance {
  fetchHTML: (
    config: IFetchHTMLConfig,
    callback?: (res: IFetchHTML) => void
  ) => Promise<IFetchHTML>

  fetchData: <T = any>(
    config: IFetchDataConfig,
    callback?: (res: IFetchCommon<T>) => void
  ) => Promise<IFetchCommonArr<T>>

  fetchFile: (
    config: IFetchFileConfig,
    callback?: (res: IFetchCommon<IFileInfo>) => void
  ) => Promise<IFetchCommonArr<IFileInfo>>

  startPolling: (
    config: IStartPollingConfig,
    callback: (count: number) => void
  ) => void
}
