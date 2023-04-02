import {
  createCrawlData,
  createCrawlFile,
  createCrawlPage,
  startPolling
} from './api'

import {
  LoaderXCrawlBaseConfig,
  XCrawlBaseConfig,
  XCrawlInstance
} from './types'
import { isUndefined } from './utils'

function loaderBaseConfig(
  baseConfig: XCrawlBaseConfig | undefined
): LoaderXCrawlBaseConfig {
  const loaderBaseConfig = baseConfig ? baseConfig : {}

  if (!loaderBaseConfig.mode) {
    loaderBaseConfig.mode = 'async'
  }

  if (isUndefined(baseConfig?.timeout)) {
    loaderBaseConfig.timeout = 10000
  }

  if (isUndefined(baseConfig?.maxRetry)) {
    loaderBaseConfig.maxRetry = 0
  }

  return loaderBaseConfig as LoaderXCrawlBaseConfig
}

function createnInstance(baseConfig: LoaderXCrawlBaseConfig): XCrawlInstance {
  const instance: XCrawlInstance = {
    crawlPage: createCrawlPage(baseConfig),
    crawlData: createCrawlData(baseConfig),
    crawlFile: createCrawlFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance {
  const newBaseConfig = loaderBaseConfig(baseConfig)

  const instance = createnInstance(newBaseConfig)

  return instance
}
