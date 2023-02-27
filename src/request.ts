import http, { RequestOptions, IncomingMessage, ClientRequest } from 'node:http'
import https from 'node:https'
import Url, { URL } from 'node:url'
import HttpsProxyAgent from 'https-proxy-agent'

import { quickSort } from './sort'
import {
  isNumber,
  isUndefined,
  log,
  logError,
  logNumber,
  logSuccess,
  random,
  sleep
} from './utils'

import { AnyObject, MapTypeEmptyObject } from './types/common'
import { RequestConfig, RequestResItem, Request } from './types/request'
import { IntervalTime } from './types/api'

function parseParams(urlSearch: string, params?: AnyObject): string {
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

function parseHeaders(
  rawConfig: RequestConfig,
  config: RequestOptions & MapTypeEmptyObject<URL>
) {
  const rawHeaders = rawConfig.headers ?? {}
  const headers: AnyObject = {
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

function handleRequestConfig(
  rawConfig: RequestConfig
): RequestOptions & MapTypeEmptyObject<URL> {
  const { protocol, hostname, port, pathname, search } = new Url.URL(
    rawConfig.url
  )
  const isHttp = protocol === 'http:'

  const config: RequestOptions & MapTypeEmptyObject<URL> = {
    agent: rawConfig.proxy
      ? HttpsProxyAgent(rawConfig.proxy)
      : isHttp
      ? new http.Agent()
      : new https.Agent(),

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

  return config
}

export function request(config: RequestConfig) {
  return new Promise<Request>((resolve, reject) => {
    const isDataUndefine = isUndefined(config.data)
    config.data = !isDataUndefine ? JSON.stringify(config.data) : config.data

    const requestConfig = handleRequestConfig(config)

    function handleRes(res: IncomingMessage) {
      const { statusCode, headers } = res

      const container: Buffer[] = []

      res.on('data', (chunk) => container.push(chunk))

      res.on('end', () => {
        const data = Buffer.concat(container)
        const resolveRes: Request = {
          statusCode,
          headers,
          data
        }

        resolve(resolveRes)
      })
    }

    let req: ClientRequest
    if (requestConfig.protocol === 'http:') {
      req = http.request(requestConfig, handleRes)
    } else {
      req = https.request(requestConfig, handleRes)
    }

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

async function useSleepByBatch(
  isHaventervalTime: boolean,
  isNumberntervalTime: boolean,
  intervalTime: any,
  id: number
) {
  if (isHaventervalTime && id > 1) {
    const timeout: number = isNumberntervalTime
      ? intervalTime
      : random(intervalTime.max, intervalTime.min)

    log(
      `Request ${logNumber(id)} needs to sleep for ${logNumber(
        timeout + 'ms'
      )} milliseconds before sending`
    )

    await sleep(timeout)
  } else {
    log(`Request ${logNumber(id)} does not need to sleep, send immediately`)
  }
}

export async function batchRequest(
  requestConifgs: RequestConfig[],
  intervalTime: IntervalTime | undefined,
  callback: (requestResItem: RequestResItem) => void
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberntervalTime = isNumber(intervalTime)

  log(
    `Begin execution, mode: async, total: ${logNumber(requestConifgs.length)} `
  )

  let index = 0
  let successTotal = 0
  let errorTotal = 0
  const requestQueue: Promise<void>[] = []
  const errorMessage: { message: string; valueOf: () => number }[] = []
  for (const requestConifg of requestConifgs) {
    const id = ++index

    await useSleepByBatch(
      isHaventervalTime,
      isNumberntervalTime,
      intervalTime,
      id
    )

    const requesttem = request(requestConifg)
      .catch((error: any) => {
        errorTotal++

        const message = `Request ${id} is an error: ${error.message}`
        const valueOf = () => id

        errorMessage.push({ message, valueOf })
      })
      .then((requestRes) => {
        if (!requestRes) return

        successTotal++
        callback({ id, ...requestRes })
      })

    requestQueue.push(requesttem)
  }

  log(logSuccess('All requests have been sent!'))

  // 等待所有请求结束
  await Promise.all(requestQueue)

  // 排序后打印错误消息
  quickSort(errorMessage).forEach((item) => log(logError(item.message)))

  log(
    `requestsTotal: ${logNumber(requestConifgs.length)}, success: ${logSuccess(
      successTotal
    )}, error: ${logError(errorTotal)}`
  )
}

export async function syncBatchRequest(
  requestConifgs: RequestConfig[],
  intervalTime: IntervalTime | undefined,
  callback: (requestResItem: RequestResItem) => void
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberntervalTime = isNumber(intervalTime)

  log(
    `Begin execution, mode: sync, total: ${logNumber(requestConifgs.length)} `
  )

  let id = 0
  let successTotal = 0
  let errorTotal = 0
  for (const requestConifg of requestConifgs) {
    id++

    await useSleepByBatch(
      isHaventervalTime,
      isNumberntervalTime,
      intervalTime,
      id
    )

    let isRequestSuccess = true
    let requestResItem: RequestResItem | null = null
    try {
      const requestRes = await request(requestConifg)
      requestResItem = { id, ...requestRes }
      log(logSuccess(`Request ${logNumber(id)} is an success`))
      successTotal++
    } catch (error: any) {
      isRequestSuccess = false
      log(logError(`Request ${id} is an error: ${error.message}`))
      errorTotal++
    }

    if (isRequestSuccess && callback) {
      callback(requestResItem as RequestResItem)
    }
  }

  log(logSuccess('All requests are over!'))

  log(
    `requestsTotal: ${logNumber(requestConifgs.length)}, success: ${logSuccess(
      successTotal
    )}, error: ${logError(errorTotal)}`
  )
}
