import fs from 'node:fs'
import { JSDOM } from 'jsdom'

import { batchRequest, request } from './request'
import { isArray, mergeConfig } from './utils'

import {
  IFetchConfig,
  IFetchFile,
  IFetchFileConfig,
  IRequest,
  IXCrawlBaseConifg
} from './types'
import path from 'node:path'

export default class XCrawl {
  private readonly baseConfig: IXCrawlBaseConifg

  constructor(baseConfig: IXCrawlBaseConifg = {}) {
    this.baseConfig = baseConfig
  }

  async fetch<T = any>(config: IFetchConfig): Promise<T> {
    const { requestConifg, intervalTime } = mergeConfig(this.baseConfig, config)

    const isRequestConifgArr = isArray(requestConifg)
    const requestConifgArr = isRequestConifgArr
      ? requestConifg
      : [requestConifg]

    const container = [] as T[]

    await batchRequest(requestConifgArr, intervalTime, (requestRes) => {
      container.push(JSON.parse(requestRes.data.toString()))
    })

    const res = isRequestConifgArr ? container : container[0]
    return res as T
  }

  fetchFile(config: IFetchFileConfig): Promise<IFetchFile> {
    return new Promise((resolve) => {
      const { requestConifg, intervalTime, fileConfig } = mergeConfig(
        this.baseConfig,
        config
      )

      let successCount = 0
      const res: IFetchFile = []

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

          res.push({
            fileName,
            mimeType,
            size: data.length,
            filePath
          })

          if (++successCount === requestConifgArr.length) {
            console.log('All files downloaded successfully!')
            resolve(res)
          }
        })
      }

      const requestConifgArr = isArray(requestConifg)
        ? requestConifg
        : [requestConifg]

      batchRequest(requestConifgArr, intervalTime, eachRequestResHandle)
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
