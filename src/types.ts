import { IncomingHttpHeaders } from 'node:http'
import { JSDOM } from 'jsdom'

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
}

export type IIntervalTime = number | { max: number; min?: number }

export interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
  mode?: 'async' | 'sync'
}

export interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}

export type IFetchHTMLConfig = string | IRequestConfig

export interface IFetchDataConfig extends IFetchBaseConifg {}

export interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}

export type IFetchCommon<T> = {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: T
}[]

export interface IFileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}

export interface IFetchHTML {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: {
    raw: string
    jsdom: JSDOM
  }
}
