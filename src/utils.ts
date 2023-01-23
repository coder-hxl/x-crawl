import Url from 'node:url'
import { IRequestConfig } from './types'

export function parseParams(params: any): string {
  let res = ''

  if (typeof params === 'object') {
    for (const key in params) {
      const value = params[key]
      res += `${key}=${value}`
    }
  } else {
    res = params
  }

  return res
}

export function handleConfig(rawConfig: IRequestConfig) {
  const { hostname, port, pathname, search } = new Url.URL(rawConfig.url)
  const params = search ? search : parseParams(rawConfig.params)
  const headers =
    rawConfig.method.toLowerCase() === 'post' && rawConfig.data
      ? {
          ...rawConfig.headers,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(rawConfig.data)
        }
      : rawConfig.headers

  const requestConfig = {
    hostname,
    port,
    path: pathname,
    search: params,
    method: rawConfig.method,
    timeout: rawConfig.timeout,
    headers
  }

  return requestConfig
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
