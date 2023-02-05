import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { batchRequest, syncBatchRequest, request } from './request'
import {
  isArray,
  isString,
  isUndefined,
  log,
  logError,
  logNumber,
  logSuccess
} from './utils'

import {
  IXCrawlBaseConifg,
  IFetchHTMLConfig,
  IFetchDataConfig,
  IFetchFileConfig,
  IFetchBaseConifg,
  IFetchCommon,
  IFileInfo,
  IFetchHTML,
  IRequestResItem,
  IRequestConfig,
  IIntervalTime
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

  private async useBatchRequestByMode(
    requestConifg: IRequestConfig | IRequestConfig[],
    intervalTime: IIntervalTime | undefined
  ) {
    const requestConfigQueue = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    let requestRes: IRequestResItem[] = []
    if (this.baseConfig.mode !== 'sync') {
      requestRes = await batchRequest(requestConfigQueue, intervalTime)
    } else {
      requestRes = await syncBatchRequest(requestConfigQueue, intervalTime)
    }

    return requestRes
  }

  async fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML> {
    const rawRequestConifg: IFetchHTMLConfig = isString(config)
      ? { url: config }
      : config

    const { requestConifg } = mergeConfig(this.baseConfig, {
      requestConifg: rawRequestConifg
    })

    const requestRes = await request(requestConifg)
    const rawData = requestRes.data.toString()

    const res: IFetchHTML = {
      ...requestRes,
      data: {
        raw: rawData,
        jsdom: new JSDOM(rawData)
      }
    }

    return res
  }

  async fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>> {
    const { requestConifg, intervalTime } = mergeConfig(this.baseConfig, config)

    const requestRes = await this.useBatchRequestByMode(
      requestConifg,
      intervalTime
    )

    const container: IFetchCommon<T> = []

    requestRes.forEach((item) => {
      const contentType = item.headers['content-type'] ?? ''
      const rawData = item.data

      const data = contentType.includes('text')
        ? rawData.toString()
        : JSON.parse(rawData.toString())

      container.push({ ...item, data })
    })

    return container
  }

  async fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>> {
    const { requestConifg, intervalTime, fileConfig } = mergeConfig(
      this.baseConfig,
      config
    )
    const requestRes = await this.useBatchRequestByMode(
      requestConifg,
      intervalTime
    )

    const container: IFetchCommon<IFileInfo> = []

    requestRes.forEach((requestResItem) => {
      const { id, headers, data } = requestResItem

      const mimeType = headers['content-type'] ?? ''
      const suffix = mimeType.split('/').pop()
      const fileName = new Date().getTime().toString()
      const filePath = path.resolve(
        fileConfig.storeDir,
        `${fileName}.${suffix}`
      )

      try {
        fs.writeFileSync(filePath, data)

        container.push({
          ...requestResItem,
          data: { fileName, mimeType, size: data.length, filePath }
        })
      } catch (error: any) {
        log(logError(`File save error at id ${id}: ${error.message}`))
      }
    })

    const saveTotal = requestRes.length
    const success = container.length
    const error = requestRes.length - container.length
    log(
      `saveTotal: ${logNumber(saveTotal)}, success: ${logSuccess(
        success
      )}, error: ${logError(error)}`
    )

    return container
  }
}
