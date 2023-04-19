import {
  createCrawlData,
  createCrawlFile,
  createCrawlPage,
  startPolling
} from './api'

import { LoaderXCrawlConfig, XCrawlConfig, XCrawlInstance } from './types'
import { isUndefined } from './utils'

function loaderBaseConfig(
  baseConfig: XCrawlConfig | undefined
): LoaderXCrawlConfig {
  const loaderBaseConfig = baseConfig ? baseConfig : {}

  if (isUndefined(loaderBaseConfig.mode)) {
    loaderBaseConfig.mode = 'async'
  }

  if (isUndefined(loaderBaseConfig.enableRandomFingerprint)) {
    loaderBaseConfig.enableRandomFingerprint = true
  }

  if (isUndefined(baseConfig?.timeout)) {
    loaderBaseConfig.timeout = 10000
  }

  if (isUndefined(baseConfig?.maxRetry)) {
    loaderBaseConfig.maxRetry = 0
  }

  return loaderBaseConfig as LoaderXCrawlConfig
}

function createnInstance(baseConfig: LoaderXCrawlConfig): XCrawlInstance {
  const instance: XCrawlInstance = {
    crawlPage: createCrawlPage(baseConfig),
    crawlData: createCrawlData(baseConfig),
    crawlFile: createCrawlFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(baseConfig?: XCrawlConfig): XCrawlInstance {
  const newBaseConfig = loaderBaseConfig(baseConfig)

  const instance = createnInstance(newBaseConfig)

  return instance
}
