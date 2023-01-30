import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { batchRequest, request } from './request'
import { isArray, isUndefined } from './utils'

import {
  IXCrawlBaseConifg,
  IFetchData,
  IFetchDataConfig,
  IFetchFile,
  IFetchFileConfig,
  IFetchBaseConifg,
  IRequest
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

  async fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchData<T>> {
    const { requestConifg, intervalTime } = mergeConfig(this.baseConfig, config)

    const requestConfigQueue = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    const container: IFetchData<T> = []

    await batchRequest(requestConfigQueue, intervalTime, (requestRes) => {
      const data: T = JSON.parse(requestRes.data.toString())
      container.push({ ...requestRes, data })
    })

    return container
  }

  fetchFile(config: IFetchFileConfig): Promise<IFetchFile> {
    return new Promise((resolve) => {
      const { requestConifg, intervalTime, fileConfig } = mergeConfig(
        this.baseConfig,
        config
      )

      const requestConfigQueue = isArray(requestConifg)
        ? requestConifg
        : [requestConifg]

      let successCount = 0
      const container: IFetchFile = []

      function eachRequestResHandle(
        requestRes: IRequest,
        currentCount: number
      ) {
        const { headers, data } = requestRes

        const mimeType = headers['content-type'] ?? ''
        const suffix = mimeType.split('/').pop()
        const fileName = new Date().getTime().toString()
        const filePath = path.resolve(
          fileConfig.storeDir,
          `${fileName}.${suffix}`
        )

        fs.createWriteStream(filePath, 'binary').write(data, (err) => {
          if (err) {
            return console.log(
              `File save error requested for the ${currentCount}: ${err.message}`
            )
          }

          container.push({
            fileName,
            mimeType,
            size: data.length,
            filePath
          })

          if (++successCount === requestConfigQueue.length) {
            console.log('All files downloaded successfully!')
            resolve(container)
          }
        })
      }

      batchRequest(requestConfigQueue, intervalTime, eachRequestResHandle)
    })
  }

  async fetchHTML(url: string): Promise<JSDOM> {
    const { requestConifg } = mergeConfig(this.baseConfig, {
      requestConifg: { url }
    })

    const requestRes = await request(requestConifg)

    const HTMLString = requestRes.data.toString()
    const dom = new JSDOM(HTMLString)

    return dom
  }
}
