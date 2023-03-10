import { IncomingHttpHeaders } from 'node:http'
import { AnyObject } from './common'

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

export interface RequestConfigObject {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
}

export interface Request {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: Buffer
}

export interface RequestResItem extends Request {
  id: number
}
