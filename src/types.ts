export interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}

export type IMapTypeObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]: T[P]
}

export type IMapTypeEmptyObject<T extends object, E extends string = ''> = {
  [P in keyof T as Exclude<P, E>]?: T[P]
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
  method: IMethod
  headers?: {
    [key: string]: number | string | string[]
  }
  params?: IAnyObject
  data?: any
  timeout?: number
}

export interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?:
    | number
    | {
        max: number
        min?: number
      }
}

export type IFetchConfig = IFetchBaseConifg

export interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}

export interface IRequest {
  contentType: string | undefined
  contentLength: string | undefined
  data: Buffer
}
