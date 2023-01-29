import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

import { batchRequest, request } from './request'
import { isArray, mergeConfig } from './utils'

import {
  IFetch,
  IFetchConfig,
  IFetchFile,
  IFetchFileConfig,
  IRequest,
  IXCrawlBaseConifg
} from './types'

export default class XCrawl {
  private readonly baseConfig: IXCrawlBaseConifg

  constructor(baseConfig: IXCrawlBaseConifg = {}) {
    this.baseConfig = baseConfig
  }

  async fetch<T = any>(config: IFetchConfig): Promise<IFetch<T>> {
    const { requestConifg, intervalTime } = mergeConfig(this.baseConfig, config)

    const requestConfigQueue = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    const container: IFetch<T> = []

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

      const requestConfigQueue = isArray(requestConifg)
        ? requestConifg
        : [requestConifg]

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
