import http, {
  RequestOptions,
  IncomingMessage,
  ClientRequest,
  IncomingHttpHeaders
} from 'node:http'
import https from 'node:https'
import Url, { URL } from 'node:url'
import HttpsProxyAgent from 'https-proxy-agent'

import { isUndefined } from './utils'

import { AnyObject, MapTypeEmptyObject } from './types/common'
import { LoaderCrawlDataDetail, LoaderCrawlFileDetail } from './api'

/* Type */
export interface Request {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: Buffer
}

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
  rawConfig: LoaderCrawlDataDetail & LoaderCrawlFileDetail,
  config: RequestOptions & MapTypeEmptyObject<URL>
) {
  const rawHeaders = rawConfig.headers ?? {}
  const headers: AnyObject = {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    ...rawHeaders
  }

  if (config.method === 'POST' && rawConfig.data) {
    headers['Content-Type'] = 'application/json'
    headers['Content-Length'] = Buffer.byteLength(rawConfig.data)
  }

  return headers
}

function handleRequestConfig(
  rawConfig: LoaderCrawlDataDetail & LoaderCrawlFileDetail
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

export function request(config: LoaderCrawlDataDetail & LoaderCrawlFileDetail) {
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
