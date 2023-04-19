import { PuppeteerLaunchOptions } from 'puppeteer'
import {
  StartPollingConfig,
  IntervalTime,
  CrawlPageSingleRes,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  CrawlFileAdvancedConfig,
  CrawlFileDetailTargetConfig,
  CrawlDataDetailTargetConfig,
  CrawlDataAdvancedConfig,
  CrawlPageDetailTargetConfig,
  CrawlPageAdvancedConfig,
  CrawlCommonConfig
} from './api'

export interface XCrawlConfig extends CrawlCommonConfig {
  baseUrl?: string
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  crawlPage?: {
    launchBrowser?: PuppeteerLaunchOptions
  }
}

export type LoaderXCrawlConfig = XCrawlConfig & {
  mode: 'async' | 'sync'
  timeout: number
  maxRetry: number
}

export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: CrawlPageDetailTargetConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: (string | CrawlPageDetailTargetConfig)[],
      callback?: (res: CrawlPageSingleRes[]) => void
    ): Promise<CrawlPageSingleRes[]>

    (
      config: CrawlPageAdvancedConfig,
      callback?: (res: CrawlPageSingleRes[]) => void
    ): Promise<CrawlPageSingleRes[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailTargetConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[],
      callback?: (res: CrawlDataSingleRes<T>[]) => void
    ): Promise<CrawlDataSingleRes<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>,
      callback?: (res: CrawlDataSingleRes<T>[]) => void
    ): Promise<CrawlDataSingleRes<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailTargetConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes>

    (
      config: CrawlFileDetailTargetConfig[],
      callback?: (res: CrawlFileSingleRes[]) => void
    ): Promise<CrawlFileSingleRes[]>

    (
      config: CrawlFileAdvancedConfig,
      callback?: (res: CrawlFileSingleRes[]) => void
    ): Promise<CrawlFileSingleRes[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
