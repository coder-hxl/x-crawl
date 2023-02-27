import {
  createFetchData,
  createFetchFile,
  createFetchHTML,
  startPolling
} from './api'

import { IXCrawlInstance, IXCrawlBaseConifg } from './types'

function createInstance(baseConfig: IXCrawlBaseConifg): IXCrawlInstance {
  const instance: IXCrawlInstance = {
    fetchHTML: createFetchHTML(baseConfig),
    fetchData: createFetchData(baseConfig),
    fetchFile: createFetchFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(
  baseConfig: IXCrawlBaseConifg = {}
): IXCrawlInstance {
  const instance = createInstance(baseConfig)

  return instance
}
