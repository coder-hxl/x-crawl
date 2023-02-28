import {
  createFetchData,
  createFetchFile,
  createFetchHTML,
  startPolling
} from './api'

import {
  LoaderXCrawlBaseConifg,
  XCrawlBaseConifg,
  XCrawlInstance
} from './types'

function loaderBaseConifg(
  baseConfig: XCrawlBaseConifg | undefined
): LoaderXCrawlBaseConifg {
  const loaderBaseConfig = baseConfig ? baseConfig : {}

  if (!loaderBaseConfig.mode) {
    loaderBaseConfig.mode = 'async'
  }

  return loaderBaseConfig as LoaderXCrawlBaseConifg
}

function createnInstance(baseConfig: LoaderXCrawlBaseConifg): XCrawlInstance {
  const instance: XCrawlInstance = {
    fetchHTML: createFetchHTML(baseConfig),
    fetchData: createFetchData(baseConfig),
    fetchFile: createFetchFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(baseConfig?: XCrawlBaseConifg): XCrawlInstance {
  const newBaseConfig = loaderBaseConifg(baseConfig)

  const instance = createnInstance(newBaseConfig)

  return instance
}
