import { RequestOptions } from 'http'
import Url, { URL } from 'node:url'

import {
  IAnyObject,
  IFetchConfig,
  IMapTypeEmptyObject,
  IRequestConfig,
  XCrawlConifg
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
  let headers

  if (config.method === 'POST' && rawConfig.data) {
    headers = {
      ...rawConfig.headers,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rawConfig.data)
    }
  } else {
    headers = rawConfig.headers
  }

  return headers
}

export function handleConfig(
  rawConfig: IRequestConfig
): RequestOptions & IMapTypeEmptyObject<URL> {
  const { hostname, port, pathname, search } = new Url.URL(rawConfig.url)

  const config: RequestOptions & IMapTypeEmptyObject<URL> = {
    hostname,
    port,
    path: pathname,
    search: parseParams(search, rawConfig.params),

    method: rawConfig.method.toLocaleUpperCase(),
    headers: {},
    timeout: rawConfig.timeout
  }

  config.headers = parseHeaders(rawConfig, config)

  return config
}

export function loaderBaseConfig(
  baseConfig: XCrawlConifg,
  config: IFetchConfig
) {
  const {
    baseUrl,
    timeout: baseTimeout,
    intervalTime: baseIntervalTime
  } = baseConfig
  const { requestConifg, intervalTime } = config

  const requestConifgArr = Array.isArray(requestConifg)
    ? [...requestConifg]
    : [requestConifg]

  for (const requestItem of requestConifgArr) {
    const { url, timeout } = requestItem

    requestItem.url = baseUrl + url

    if (isUndefined(timeout) && !isUndefined(baseTimeout)) {
      requestItem.timeout = baseTimeout
    }
  }

  if (isUndefined(intervalTime) && !isUndefined(baseIntervalTime)) {
    config.intervalTime = baseIntervalTime
  }

  return config
}

export function isUndefined(value: any) {
  return typeof value === 'undefined'
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
