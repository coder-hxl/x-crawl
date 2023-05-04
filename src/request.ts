import http, {
  RequestOptions,
  IncomingMessage,
  ClientRequest,
  IncomingHttpHeaders
} from 'node:http'
import https from 'node:https'
import Url from 'node:url'
import querystring from 'node:querystring'

import HttpsProxyAgent from 'https-proxy-agent'

import { isUndefined } from './utils'

import { AnyObject } from './types/common'
import { LoaderCrawlDataDetail, LoaderCrawlFileDetail } from './api'

/* Type */
export interface Request {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: Buffer
}

function parseHeaders(
  rawConfig: LoaderCrawlDataDetail & LoaderCrawlFileDetail,
  config: RequestOptions
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
): RequestOptions {
  const { protocol, hostname, port, pathname, search } = new Url.URL(
    rawConfig.url
  )
  const isHttp = protocol === 'http:'

  let path = pathname
  if (search || rawConfig.params) {
    if (search) {
      path += `${search}${
        rawConfig.params ? '&' + querystring.stringify(rawConfig.params) : ''
      }`
    } else {
      path += `?${querystring.stringify(rawConfig.params)}`
    }
  }

  const config: RequestOptions = {
    agent: rawConfig.proxyUrl
      ? HttpsProxyAgent(rawConfig.proxyUrl)
      : isHttp
      ? new http.Agent()
      : new https.Agent(),

    protocol,
    hostname,
    port,
    path,

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
