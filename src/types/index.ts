import {
  FetchResCommonV1,
  FetchResCommonArrV1,
  FetchDataConfig,
  FetchFileConfig,
  FetchHTML,
  FetchHTMLConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime
} from './api'
import { MapTypeObject } from './common'

export interface XCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}

interface LoaderXCrawlBaseConifgValue {
  mode: 'async' | 'sync'
}

export type LoaderXCrawlBaseConifg = XCrawlBaseConifg &
  MapTypeObject<LoaderXCrawlBaseConifgValue>

export interface XCrawlInstance {
  fetchHTML: (
    config: FetchHTMLConfig,
    callback?: (res: FetchHTML) => void
  ) => Promise<FetchHTML>

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
