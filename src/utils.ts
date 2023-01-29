import { Agent } from 'http'
import { Agent as httpsAgent } from 'https'
import Url, { URL } from 'node:url'

import { RequestOptions } from 'http'
import {
  IAnyObject,
  IFetchBaseConifg,
  IMapTypeEmptyObject,
  IRequestConfig,
  IXCrawlBaseConifg
} from './types'

export function parseParams(urlSearch: string, params?: IAnyObject): string {
  let res = urlSearch ? `${urlSearch}` : '?'

  if (params) {
    for (const key in params) {
      const value = params[key]
      res += `&${key}=${value}`
    }
  } else {
    res = urlSearch
  }

  return res
}

export function parseHeaders(
  rawConfig: IRequestConfig,
  config: RequestOptions & IMapTypeEmptyObject<URL>
) {
  const rawHeaders = rawConfig.headers ?? {}
  const headers: IAnyObject = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    ...rawHeaders
  }

  if (config.method === 'POST' && rawConfig.data) {
    headers['Content-Type'] = 'application/json'
    headers['Content-Length'] = Buffer.byteLength(rawConfig.data)
  }

  return headers
}

export function handleRequestConfig(
  rawConfig: IRequestConfig
): RequestOptions & IMapTypeEmptyObject<URL> {
  const { protocol, hostname, port, pathname, search } = new Url.URL(
    rawConfig.url
  )

  const config: RequestOptions & IMapTypeEmptyObject<URL> = {
    protocol,
    hostname,
    port,
    path: pathname,
    search: parseParams(search, rawConfig.params),

    method: rawConfig.method?.toLocaleUpperCase() ?? 'GET',
    headers: {},
    timeout: rawConfig.timeout
  }

  config.headers = parseHeaders(rawConfig, config)

  if (protocol === 'http:') {
    config.agent = new Agent()
  } else {
    config.agent = new httpsAgent()
  }

  return config
}

export function mergeConfig<T extends IFetchBaseConifg>(
  baseConfig: IXCrawlBaseConifg,
  config: T
): IFetchBaseConifg & T {
  const {
    baseUrl,
    timeout: baseTimeout,
    intervalTime: baseIntervalTime
  } = baseConfig
  const { requestConifg, intervalTime } = config

  const requestConifgArr = isArray(requestConifg)
    ? requestConifg
    : [requestConifg]

  for (const requestItem of requestConifgArr) {
    const { url, timeout } = requestItem

    if (!isUndefined(baseUrl)) {
      requestItem.url = baseUrl + url
    }

    if (isUndefined(timeout) && !isUndefined(baseTimeout)) {
      requestItem.timeout = baseTimeout
    }
  }

  if (isUndefined(intervalTime) && !isUndefined(baseIntervalTime)) {
    config.intervalTime = baseIntervalTime
  }

  return config
}

export function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function random(max: number, min = 0) {
  let res = Math.floor(Math.random() * max)

  if (res < min) {
    res = random(max, min)
  }

  return res
}

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}
