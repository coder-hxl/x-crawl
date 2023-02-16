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
  logSuccess,
  logWarn
} from './utils'

import {
  IXCrawlBaseConifg,
  IFetchHTMLConfig,
  IFetchDataConfig,
  IFetchFileConfig,
  IFetchPollingConfig,
  IFetchBaseConifg,
  IFetchCommon,
  IFileInfo,
  IFetchHTML,
  IRequestResItem,
  IRequestConfig,
  IIntervalTime
} from './types'

export default class XCrawl {
  private readonly baseConfig: IXCrawlBaseConifg

  constructor(baseConfig: IXCrawlBaseConifg = {}) {
    this.baseConfig = baseConfig
  }

  private mergeConfig<T extends IFetchBaseConifg>(rawConfig: T): T {
    const baseConfig = this.baseConfig
    const newConfig = structuredClone(rawConfig)

    // 1.处理 requestConifg
    const requestConifgArr = isArray(newConfig.requestConifg)
      ? newConfig.requestConifg
      : [newConfig.requestConifg]
    for (const requestItem of requestConifgArr) {
      const { url, timeout, proxy } = requestItem

      // 1.1.baseUrl
      if (!isUndefined(baseConfig.baseUrl)) {
        requestItem.url = baseConfig.baseUrl + url
      }

      // 1.2.timeout
      if (isUndefined(timeout)) {
        requestItem.timeout = baseConfig.timeout
      }

      // 1.3.porxy
      if (isUndefined(proxy)) {
        requestItem.proxy = baseConfig.proxy
      }
    }

    // 2.处理 intervalTime
    if (isUndefined(newConfig.intervalTime)) {
      newConfig.intervalTime = baseConfig.intervalTime
    }

    return newConfig
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
    const { requestConifg } = this.mergeConfig({
      requestConifg: isString(config) ? { url: config } : config
    })

    const requestRes = await request(requestConifg)
    const html = requestRes.data.toString()

    const res: IFetchHTML = {
      ...requestRes,
      data: {
        html,
        jsdom: new JSDOM(html)
      }
    }

    return res
  }

  async fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>> {
    const { requestConifg, intervalTime } = this.mergeConfig(config)

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
    const { requestConifg, intervalTime, fileConfig } = this.mergeConfig(config)

    const requestRes = await this.useBatchRequestByMode(
      requestConifg,
      intervalTime
    )

    const container: IFetchCommon<IFileInfo> = []

    requestRes.forEach((requestResItem) => {
      const { id, headers, data } = requestResItem

      const mimeType = headers['content-type'] ?? ''
      const fileExtension = fileConfig.extension ?? mimeType.split('/').pop()
      const fileName = new Date().getTime().toString()
      const filePath = path.resolve(
        fileConfig.storeDir,
        `${fileName}.${fileExtension}`
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
    const error = saveTotal - success
    log(
      `saveTotal: ${logNumber(saveTotal)}, success: ${logSuccess(
        success
      )}, error: ${logError(error)}`
    )

    return container
  }

  fetchPolling(config: IFetchPollingConfig, callback: (count: number) => void) {
    const { Y, M, d, h, m } = config

    const year = !isUndefined(Y) ? Y * 1000 * 60 * 60 * 24 * 365 : 0
    const month = !isUndefined(M) ? M * 1000 * 60 * 60 * 24 * 30 : 0
    const day = !isUndefined(d) ? d * 1000 * 60 * 60 * 24 : 0
    const hour = !isUndefined(h) ? h * 1000 * 60 * 60 : 0
    const minute = !isUndefined(m) ? m * 1000 * 60 : 0
    const total = year + month + day + hour + minute

    let count = 0
    function cb() {
      console.log(logWarn(`Start the ${logWarn.bold(++count)} polling`))
      callback(count)
    }

    cb()
    setInterval(cb, total)
  }
}
