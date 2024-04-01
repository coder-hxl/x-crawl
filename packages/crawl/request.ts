import http, {
  RequestOptions,
  IncomingMessage,
  ClientRequest,
  IncomingHttpHeaders
} from 'node:http'
import https from 'node:https'
import Url from 'node:url'
import querystring from 'node:querystring'

import { HttpsProxyAgent } from 'https-proxy-agent'

import { isObject, isUndefined } from '../shared'

import { AnyObject } from './types/common'
import { LoaderCrawlDataDetail, LoaderCrawlFileDetail } from './api'

/* Type */
export interface Request {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: Buffer
}

interface ContentConfig {
  protocol: 'http:' | 'https:'
  data: string | undefined

  requestConfig: RequestOptions
}

function parseHeaders(
  rawRequestConfig: LoaderCrawlDataDetail & LoaderCrawlFileDetail,
  contentConfig: ContentConfig
) {
  const rawHeaders = rawRequestConfig.headers ?? {}
  const { requestConfig, data } = contentConfig

  const headers: AnyObject = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    ...rawHeaders
  }

  if (!isUndefined(data)) {
    const defaultHeaderConfig = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Content-Length', value: Buffer.byteLength(data) }
    ]

    defaultHeaderConfig.forEach((item) => {
      const { key, value } = item

      if (isUndefined(rawHeaders[key])) {
        headers[key] = value
      }
    })
  }

  requestConfig.headers = headers
}

function createContentConfig(
  rawRequestConfig: LoaderCrawlDataDetail & LoaderCrawlFileDetail
): ContentConfig {
  const {
    data: rawData,
    url,
    params,
    proxyUrl,
    timeout,
    method
  } = rawRequestConfig
  const { protocol, hostname, port, pathname, search } = new Url.URL(url)

  let path = pathname
  if (search || params) {
    if (search) {
      path += `${search}${params ? '&' + querystring.stringify(params) : ''}`
    } else {
      path += `?${querystring.stringify(params)}`
    }
  }

  const contentConfig: ContentConfig = {
    requestConfig: {
      agent: proxyUrl
        ? new HttpsProxyAgent(proxyUrl)
        : protocol === 'http:'
        ? new http.Agent()
        : new https.Agent(),

      protocol,
      hostname,
      port,
      path,

      method: method?.toLocaleUpperCase() ?? 'GET',
      headers: {},
      timeout
    },

    protocol: protocol as 'http:' | 'https:',
    data: isObject(rawData) ? JSON.stringify(rawData) : rawData
  }

  parseHeaders(rawRequestConfig, contentConfig)

  return contentConfig
}

export function request(config: LoaderCrawlDataDetail & LoaderCrawlFileDetail) {
  return new Promise<Request>((resolve, reject) => {
    const { requestConfig, protocol, data } = createContentConfig(config)

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

    const req: ClientRequest =
      protocol === 'http:'
        ? http.request(requestConfig, handleRes)
        : https.request(requestConfig, handleRes)

    req.on('timeout', () => {
      reject(new Error(`Timeout ${requestConfig.timeout}ms`))
    })

    req.on('error', (err) => {
      reject(err)
    })

    // 其他处理
    if (!isUndefined(data)) {
      req.write(data)
    }

    req.end()
  })
}
