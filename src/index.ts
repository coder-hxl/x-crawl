import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { batchRequest, syncBatchRequest, request } from './request'
import { quickSort } from './sort'
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
  IFileInfo,
  IFetchHTML,
  IRequestResItem,
  IRequestConfig,
  IIntervalTime,
  IFetchCommon,
  IFetchCommonArr
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
    intervalTime: IIntervalTime | undefined,
    callback: (requestResItem: IRequestResItem) => void
  ) {
    const requestConfigQueue = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    if (this.baseConfig.mode !== 'sync') {
      await batchRequest(requestConfigQueue, intervalTime, callback)
    } else {
      await syncBatchRequest(requestConfigQueue, intervalTime, callback)
    }
  }

  async fetchHTML(
    config: IFetchHTMLConfig,
    callback?: (res: IFetchHTML) => void
  ): Promise<IFetchHTML> {
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

    if (callback) {
      callback(res)
    }

    return res
  }

  async fetchData<T = any>(
    config: IFetchDataConfig,
    callback?: (res: IFetchCommon<T>) => void
  ): Promise<IFetchCommonArr<T>> {
    const { requestConifg, intervalTime } = this.mergeConfig(config)

    const container: IFetchCommonArr<T> = []
    function handleResItem(requestResItem: IRequestResItem) {
      const contentType = requestResItem.headers['content-type'] ?? ''
      const rawData = requestResItem.data

      const data = contentType.includes('text')
        ? rawData.toString()
        : JSON.parse(rawData.toString())

      const itemRes = { ...requestResItem, data }

      if (callback) {
        callback(itemRes)
      }

      container.push(itemRes)
    }

    await this.useBatchRequestByMode(requestConifg, intervalTime, handleResItem)

    const res = quickSort(
      container.map((item) => ({ ...item, valueOf: () => item.id }))
    )
    return res
  }

  async fetchFile(
    config: IFetchFileConfig,
    callback?: (res: IFetchCommon<IFileInfo>) => void
  ): Promise<IFetchCommonArr<IFileInfo>> {
    const { requestConifg, intervalTime, fileConfig } = this.mergeConfig(config)

    const container: IFetchCommonArr<IFileInfo> = []
    const saveFileArr: Promise<void>[] = []
    const saveFileErrorArr: { message: string; valueOf: () => number }[] = []

    if (!fs.existsSync(fileConfig.storeDir)) {
      fs.mkdirSync(fileConfig.storeDir)
    }

    function handleResItem(requestResItem: IRequestResItem) {
      const { id, headers, data } = requestResItem

      const mimeType = headers['content-type'] ?? ''
      const fileExtension = fileConfig.extension ?? mimeType.split('/').pop()
      const fileName = new Date().getTime().toString()
      const filePath = path.resolve(
        fileConfig.storeDir,
        `${fileName}.${fileExtension}`
      )

      const saveFileItem = writeFile(filePath, data)
        .catch((err) => {
          const message = `File save error at id ${id}: ${err.message}`
          const valueOf = () => id

          saveFileErrorArr.push({ message, valueOf })

          return true
        })
        .then((isError) => {
          if (isError) return

          const res = {
            ...requestResItem,
            data: { fileName, mimeType, size: data.length, filePath }
          }

          if (callback) {
            callback(res)
          }

          container.push(res)
        })

      saveFileArr.push(saveFileItem)
    }

    await this.useBatchRequestByMode(requestConifg, intervalTime, handleResItem)

    // 等待保存文件任务完成
    await Promise.all(saveFileArr)

    // 打印保存文件的错误
    quickSort(saveFileErrorArr).forEach((item) => log(logError(item.message)))

    const saveFileTotal = isArray(requestConifg) ? requestConifg.length : 1
    const success = container.length
    const error = saveFileTotal - success
    log(
      `saveFileTotal: ${logNumber(saveFileTotal)}, success: ${logSuccess(
        success
      )}, error: ${logError(error)}`
    )

    // 排序结果
    const res = quickSort(
      container.map((item) => ({ ...item, valueOf: () => item.id }))
    )

    return res
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
    function startCallback() {
      console.log(logWarn(`Start the ${logWarn.bold(++count)} polling`))
      callback(count)
    }

    startCallback()
    setInterval(startCallback, total)
  }
}
