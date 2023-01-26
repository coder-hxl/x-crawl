import fs from 'node:fs'

import { batchRequest } from './request'
import { isArray, mergeConfig } from './utils'

import {
  IFetchConfig,
  IFetchFileConfig,
  IRequest,
  IXCrawlBaseConifg
} from './types'

export default class XCrawl {
  baseConfig: IXCrawlBaseConifg

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

  async fetchFile(config: IFetchFileConfig): Promise<void> {
    const { requestConifg, intervalTime, fileConfig } = mergeConfig(
      this.baseConfig,
      config
    )

    let successCount = 0

    function eachRequestResHandle(requestRes: IRequest, currentCount: number) {
      const { headers, data } = requestRes

      const fileType = headers['content-type']?.split('/').pop()
      const filename = `${new Date().getTime()}.${fileType}`
      const path = `${fileConfig.storeDir}/${filename}`

      fs.createWriteStream(path, 'binary').write(data, (err) => {
        if (err) {
          return console.log(
            `File save error requested for the ${currentCount}: ${err.message}`
          )
        }

        if (++successCount === requestConifgArr.length) {
          console.log('All files downloaded successfully!')
        }
      })
    }

    const requestConifgArr = isArray(requestConifg)
      ? requestConifg
      : [requestConifg]

    await batchRequest(requestConifgArr, intervalTime, eachRequestResHandle)
  }
}
