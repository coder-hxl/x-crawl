import { PuppeteerLaunchOptions } from 'puppeteer'
import {
  IntervalTime,
  CrawlPageSingleResult,
  CrawlDataSingleResult,
  CrawlFileSingleResult,
  CrawlFileAdvancedConfig,
  CrawlFileDetailTargetConfig,
  CrawlDataDetailTargetConfig,
  CrawlDataAdvancedConfig,
  CrawlPageDetailTargetConfig,
  CrawlPageAdvancedConfig,
  CrawlCommonConfig,
  CrawlHTMLSingleResult,
  CrawlHTMLDetailTargetConfig,
  CrawlHTMLAdvancedConfig
} from './api'
import { MapTypeEmptyObject } from './common'

export interface LogConfig {
  start: boolean
  process: boolean
  result: boolean
}

export interface XCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  log?: MapTypeEmptyObject<LogConfig> | boolean
  crawlPage?: {
    puppeteerLaunch?: PuppeteerLaunchOptions
  }
}

export interface XCrawlInstanceConfig
  extends MapTypeEmptyObject<XCrawlConfig, 'log'> {
  id: number

  mode: 'async' | 'sync'
  enableRandomFingerprint: boolean
  timeout: number
  maxRetry: number
  logConfig: LogConfig
}

export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (result: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: CrawlPageDetailTargetConfig,
      callback?: (result: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[],
      callback?: (result: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>

    (
      config: CrawlPageAdvancedConfig,
      callback?: (result: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>
  }

  crawlHTML: {
    (
      config: string,
      callback?: (result: CrawlHTMLSingleResult) => void
    ): Promise<CrawlHTMLSingleResult>

    (
      config: CrawlHTMLDetailTargetConfig,
      callback?: (result: CrawlHTMLSingleResult) => void
    ): Promise<CrawlHTMLSingleResult>

    (
      config: (string | CrawlHTMLDetailTargetConfig)[],
      callback?: (result: CrawlHTMLSingleResult[]) => void
    ): Promise<CrawlHTMLSingleResult[]>

    (
      config: CrawlHTMLAdvancedConfig,
      callback?: (result: CrawlHTMLSingleResult[]) => void
    ): Promise<CrawlHTMLSingleResult[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailTargetConfig,
      callback?: (result: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: string,
      callback?: (result: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[],
      callback?: (result: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>,
      callback?: (result: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailTargetConfig,
      callback?: (result: CrawlFileSingleResult) => void
    ): Promise<CrawlFileSingleResult>

    (
      config: CrawlFileDetailTargetConfig[],
      callback?: (result: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>

    (
      config: CrawlFileAdvancedConfig,
      callback?: (result: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>
  }
}
