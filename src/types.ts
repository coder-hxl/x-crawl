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

export interface IRequestConfig<T = any> {
  url: string
  method: IMethod
  headers?: {
    [key: string]: number | string | string[]
  }
  params?: any
  data?: T
  timeout?: number
}

export interface IBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: {
    max: number
    min?: number
  }
}

export type IFetchConfig = IBaseConifg

export interface IFetchFileConfig extends IBaseConifg {
  fileConfig: {
    storeDir: string
    suffix: string
  }
}
