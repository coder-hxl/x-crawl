import {
  createFetchData,
  createFetchFile,
  createFetchHTML,
  startPolling
} from './api'

import { XCrawlBaseConifg, XCrawlInstance } from './types'

function createnstance(baseConfig: XCrawlBaseConifg): XCrawlInstance {
  const instance: XCrawlInstance = {
    fetchHTML: createFetchHTML(baseConfig),
    fetchData: createFetchData(baseConfig),
    fetchFile: createFetchFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(
  baseConfig: XCrawlBaseConifg = {}
): XCrawlInstance {
  const instance = createnstance(baseConfig)

  return instance
}
