import { fetch } from './service'

import { IFetchConfig, XCrawlConifg } from './types'
import { loaderBaseConfig } from './utils'

export default class XCrawl {
  baseConfig: XCrawlConifg

  constructor(XCrawlConfig: XCrawlConifg) {
    this.baseConfig = XCrawlConfig
  }

  async fetch<T = any>(config: IFetchConfig): Promise<T> {
    const loaderRes = loaderBaseConfig(this.baseConfig, config)

    return fetch(loaderRes)
  }
}
