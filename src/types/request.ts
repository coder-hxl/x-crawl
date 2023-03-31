import { AnyObject } from './common'
import { Protocol } from 'puppeteer'

export type Method =
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

export type PageRequestConfigCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]

export interface PageRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  cookies?: PageRequestConfigCookies
  maxRetry?: number
}

export interface DataRequestConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
  maxRetry?: number
}

export interface FileRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  maxRetry?: number
}
