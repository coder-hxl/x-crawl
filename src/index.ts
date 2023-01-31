import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { batchRequest, request } from './request'
import { isArray, isString, isUndefined } from './utils'

import {
  IXCrawlBaseConifg,
  IFetchDataConfig,
  IFetchFileConfig,
  IFetchHTMLConfig,
  IFetchBaseConifg,
  IFileInfo,
  IFetchCommon,
  IRequestResItem
} from './types'

function mergeConfig<T extends IFetchBaseConifg>(
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

export default class XCrawl {
  private readonly baseConfig: IXCrawlBaseConifg

  constructor(baseConfig: IXCrawlBaseConifg = {}) {
    this.baseConfig = baseConfig
  }

  async fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>> {
    const { requestConifg, intervalTime } = mergeConfig(this.baseConfig, config)

    const requestConfigQueue = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    const container: IFetchCommon<T> = []

    await batchRequest(
      requestConfigQueue,
      intervalTime,
      (error, requestResItem) => {
        if (error) return

        const contentType = requestResItem.headers['content-type'] ?? ''
        const rawData = requestResItem.data

        const data = contentType.includes('text')
          ? rawData.toString()
          : JSON.parse(rawData.toString())

        container.push({ ...requestResItem, data })
      }
    )

    return container
  }

  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>> {
    return new Promise((resolve) => {
      const { requestConifg, intervalTime, fileConfig } = mergeConfig(
        this.baseConfig,
        config
      )

      const requestConfigQueue = isArray(requestConifg)
        ? requestConifg
        : [requestConifg]

      const requestTotal = requestConfigQueue.length
      const container: IFetchCommon<IFileInfo> = []

      function batchRequestResHandle(
        error: Error | null,
        requestResItem: IRequestResItem
      ) {
        if (error) {
          if (requestResItem.id === requestTotal) {
            resolve(container)
          }

          return
        }

        const { id, statusCode, headers, data } = requestResItem

        const mimeType = headers['content-type'] ?? ''
        const suffix = mimeType.split('/').pop()
        const fileName = new Date().getTime().toString()
        const filePath = path.resolve(
          fileConfig.storeDir,
          `${fileName}.${suffix}`
        )

        fs.createWriteStream(filePath, 'binary').write(data, (err) => {
          if (err) {
            return console.log(`File save error at id ${id}: ${err.message}`)
          }

          const fileInfo: IFileInfo = {
            fileName,
            mimeType,
            size: data.length,
            filePath
          }

          container.push({ id, statusCode, headers, data: fileInfo })

          if (id === requestTotal) {
            resolve(container)
          }
        })
      }

      batchRequest(requestConfigQueue, intervalTime, batchRequestResHandle)
    })
  }

  async fetchHTML(config: string | IFetchHTMLConfig): Promise<JSDOM> {
    const rawRequestConifg: IFetchHTMLConfig = isString(config)
      ? { url: config }
      : config

    const { requestConifg } = mergeConfig(this.baseConfig, {
      requestConifg: rawRequestConifg
    })

    const requestResItem = await request(requestConifg)

    const dom = new JSDOM(requestResItem.data)

    return dom
  }
}
