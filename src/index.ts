import {
  createFetchData,
  createFetchFile,
  createFetchPage,
  startPolling
} from './api'

import {
  LoaderXCrawlBaseConfig,
  XCrawlBaseConfig,
  XCrawlInstance
} from './types'

function loaderBaseConfig(
  baseConfig: XCrawlBaseConfig | undefined
): LoaderXCrawlBaseConfig {
  const loaderBaseConfig = baseConfig ? baseConfig : {}

  if (!loaderBaseConfig.mode) {
    loaderBaseConfig.mode = 'async'
  }

  return loaderBaseConfig as LoaderXCrawlBaseConfig
}

function createnInstance(baseConfig: LoaderXCrawlBaseConfig): XCrawlInstance {
  const instance: XCrawlInstance = {
    fetchPage: createFetchPage(baseConfig),
    fetchData: createFetchData(baseConfig),
    fetchFile: createFetchFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance {
  const newBaseConfig = loaderBaseConfig(baseConfig)

  const instance = createnInstance(newBaseConfig)

  return instance
}
