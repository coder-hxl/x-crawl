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

import {
  IIntervalTime,
  IRequest,
  IRequestConfig,
  IAnyObject,
  IMapTypeEmptyObject,
  IRequestResItem
} from './types'

function parseParams(urlSearch: string, params?: IAnyObject): string {
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

function handleRequestConfig(
  rawConfig: IRequestConfig
): RequestOptions & IMapTypeEmptyObject<URL> {
  const { protocol, hostname, port, pathname, search } = new Url.URL(
    rawConfig.url
  )
  const isHttp = protocol === 'http:'

  const config: RequestOptions & IMapTypeEmptyObject<URL> = {
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

export function request(config: IRequestConfig) {
  return new Promise<IRequest>((resolve, reject) => {
    const isDataUndefine = isUndefined(config.data)
    config.data = !isDataUndefine ? JSON.stringify(config.data) : config.data

    const requestConfig = handleRequestConfig(config)

    function handleRes(res: IncomingMessage) {
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
  isHaveIntervalTime: boolean,
  isNumberIntervalTime: boolean,
  intervalTime: any,
  id: number
) {
  if (isHaveIntervalTime && id > 1) {
    const timeout: number = isNumberIntervalTime
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
  requestConifgs: IRequestConfig[],
  intervalTime: IIntervalTime | undefined,
  callback: (requestResItem: IRequestResItem) => void
) {
  const isHaveIntervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

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
      isHaveIntervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    const requestItem = request(requestConifg)
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

    requestQueue.push(requestItem)
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
  requestConifgs: IRequestConfig[],
  intervalTime: IIntervalTime | undefined,
  callback: (requestResItem: IRequestResItem) => void
) {
  const isHaveIntervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  log(
    `Begin execution, mode: sync, total: ${logNumber(requestConifgs.length)} `
  )

  let id = 0
  let successTotal = 0
  let errorTotal = 0
  for (const requestConifg of requestConifgs) {
    id++

    await useSleepByBatch(
      isHaveIntervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    let isRequestSuccess = true
    let requestResItem: IRequestResItem | null = null
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
      callback(requestResItem as IRequestResItem)
    }
  }

  log(logSuccess('All requests are over!'))

  log(
    `requestsTotal: ${logNumber(requestConifgs.length)}, success: ${logSuccess(
      successTotal
    )}, error: ${logError(errorTotal)}`
  )
}
