import {
  FetchResCommonV1,
  FetchResCommonArrV1,
  FetchDataConfig,
  FetchFileConfig,
  FetchPage,
  FetchPageConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime
} from './api'

export interface XCrawlBaseConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}

export type LoaderXCrawlBaseConfig = XCrawlBaseConfig & {
  mode: 'async' | 'sync'
}

export interface XCrawlInstance {
  fetchPage: (
    config: FetchPageConfig,
    callback?: (res: FetchPage) => void
  ) => Promise<FetchPage>

  fetchData: <T = any>(
    config: FetchDataConfig,
    callback?: (res: FetchResCommonV1<T>) => void
  ) => Promise<FetchResCommonArrV1<T>>

  fetchFile: (
    config: FetchFileConfig,
    callback?: (res: FetchResCommonV1<FileInfo>) => void
  ) => Promise<FetchResCommonArrV1<FileInfo>>

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number) => void
  ) => void
}
