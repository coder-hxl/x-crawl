import http, { Agent, RequestOptions } from 'node:http'
import { Agent as httpsAgent } from 'https'
import Url, { URL } from 'node:url'

import { isNumber, isUndefined, random, sleep } from './utils'

import {
  IIntervalTime,
  IRequest,
  IRequestConfig,
  IAnyObject,
  IMapTypeEmptyObject
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

export function request(config: IRequestConfig) {
  return new Promise<IRequest>((resolve, reject) => {
    const isDataUndefine = isUndefined(config.data)
    config.data = !isDataUndefine ? JSON.stringify(config.data) : config.data

    const requestConfig = handleRequestConfig(config)

    const req = http.request(requestConfig, (res) => {
      const { statusCode, headers } = res

      const container: Buffer[] = []

      res.on('data', (chunk) => container.push(chunk))

      res.on('end', () => {
        const data = Buffer.concat(container)
        const resolveRes: IRequest = {
          statusCode,
          headers,
          data
        }

        resolve(resolveRes)
      })
    })

    req.on('timeout', () => {
      reject(new Error(`Timeout ${config.timeout}ms`))
    })

    req.on('error', (err) => {
      reject(err)
    })

    // 其他处理
    if (requestConfig.method === 'POST' && !isDataUndefine) {
      req.write(config.data)
    }

    req.end()
  })
}

export async function batchRequest(
  requestConifgs: IRequestConfig[],
  intervalTime: IIntervalTime | undefined,
  eachRequestResHandle: (requestRes: IRequest, currentCount: number) => any
) {
  const total = requestConifgs.length
  let currentCount = 0

  console.log(`Begin execution, total: ${total} `)

  for (const requestConifg of requestConifgs) {
    currentCount++

    const requestRes = await request(requestConifg)

    eachRequestResHandle(requestRes, currentCount)

    if (!isUndefined(intervalTime) && currentCount !== total) {
      const timeout = isNumber(intervalTime)
        ? intervalTime
        : random(intervalTime.max, intervalTime.min)

      console.log(
        `The ${currentCount} request is success, sleep for ${timeout}ms`
      )

      await sleep(timeout)
    } else {
      console.log(
        `The ${currentCount} request is success, all requests completed!`
      )
    }
  }
}
