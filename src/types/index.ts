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
    (config: string): Promise<CrawlPageSingleResult>

    (config: CrawlPageDetailTargetConfig): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[]
    ): Promise<CrawlPageSingleResult[]>

    (config: CrawlPageAdvancedConfig): Promise<CrawlPageSingleResult[]>
  }

  crawlHTML: {
    (config: string): Promise<CrawlHTMLSingleResult>

    (config: CrawlHTMLDetailTargetConfig): Promise<CrawlHTMLSingleResult>

    (
      config: (string | CrawlHTMLDetailTargetConfig)[]
    ): Promise<CrawlHTMLSingleResult[]>

    (config: CrawlHTMLAdvancedConfig): Promise<CrawlHTMLSingleResult[]>
  }

  crawlData: {
    <T = any>(config: string): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: CrawlDataDetailTargetConfig
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[]
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

    (config: CrawlFileDetailTargetConfig[]): Promise<CrawlFileSingleResult[]>

    (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
  }
}
