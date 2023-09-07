import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawl'
import { priorityQueueMergeSort } from './sort'

import {
  ExtraCommonConfig,
  LoaderCrawlDataDetail,
  LoaderCrawlFileDetail,
  LoaderCrawlHTMLDetail,
  LoaderCrawlPageDetail,
  ProxyDetails
} from './api'

import {
  isObject,
  isUndefined,
  log,
  logError,
  logStart,
  logStatistics,
  logSuccess,
  logWarn
} from './utils'
import { HTTPResponse } from 'puppeteer'
import { Request } from './request'
import { CrawlCommonResult } from './types/api'

export type CrawlDetail =
  | LoaderCrawlPageDetail
  | LoaderCrawlHTMLDetail
  | LoaderCrawlDataDetail
  | LoaderCrawlFileDetail

interface DeviceResult extends CrawlCommonResult {
  data: any
}

export interface Device<T extends CrawlDetail, R> {
  id: number

  isHandle: boolean
  isSuccess: boolean
  isStatusNormal: boolean

  detailTargetConfig: T
  detailTargetResult: R | null

  maxRetry: number
  retryCount: number
  proxyDetails: ProxyDetails
  crawlErrorQueue: Error[]

  result: DeviceResult
}

export function isCrawlStatusInHttpStatus(device: Device<CrawlDetail, any>) {
  const { detailTargetConfig, detailTargetResult } = device

  let status: number | null = null

  if (
    isObject(detailTargetResult) &&
    Object.hasOwn(detailTargetResult, 'response') &&
    (detailTargetResult as any).response
  ) {
    // crawlPage
    const response: HTTPResponse = (detailTargetResult as any).response
    status = response.status()
  } else if (isObject(detailTargetResult)) {
    // crawlData / crawlFie
    status = (detailTargetResult as any as Request).statusCode ?? null
  }

  let result = false
  const switchByHttpStatus = detailTargetConfig.proxy?.switchByHttpStatus
  if (status && switchByHttpStatus && switchByHttpStatus.includes(status)) {
    result = true
  }

  return result
}

export async function controller<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  mode: 'async' | 'sync',
  detailTargets: T[],
  extraConfig: E,
  singleCrawlHandle: (device: Device<T, R>, extraConfig: E) => Promise<void>
) {
  const { type } = extraConfig

  // 是否使用优先爬取
  const isPriorityCrawl = !detailTargets.every(
    (item) => item.priority === detailTargets[0].priority
  )
  const detailTargetConfigs = isPriorityCrawl
    ? priorityQueueMergeSort(
        detailTargets.map((item) => ({ ...item, valueOf: () => item.priority }))
      )
    : detailTargets

  // 生成装置
  const devices: Device<T, R>[] = detailTargetConfigs.map(
    (detailTargetConfig, index) => {
      const id = ++index
      const { maxRetry, proxyDetails } = detailTargetConfig
      const crawlErrorQueue: Error[] = []

      return {
        id,

        isHandle: false,
        isSuccess: false,
        isStatusNormal: false,

        detailTargetConfig,
        detailTargetResult: null,

        maxRetry,
        retryCount: 0,
        proxyDetails,
        crawlErrorQueue,

        result: {
          id,
          isSuccess: false,
          maxRetry,
          retryCount: 0,
          proxyDetails,
          crawlErrorQueue,
          data: null
        }
      }
    }
  )

  log(
    logStart(
      `Start crawling - type: ${type}, mode: ${mode}, total: ${devices.length}`
    )
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

  let i = 0
  let crawlQueue: Device<T, R>[] = devices
  while (crawlQueue.length) {
    await batchCrawl(crawlQueue, extraConfig, singleCrawlHandle)

    crawlQueue = crawlQueue.filter((device) => {
      const {
        isHandle,
        retryCount,
        maxRetry,
        detailTargetConfig,
        proxyDetails,
        crawlErrorQueue,
        isStatusNormal
      } = device

      // 没有被处理 / 没成功 / 状态码不符合
      let isRetry = false
      const haveRetryChance = retryCount < maxRetry
      if (!isHandle && haveRetryChance) {
        isRetry = true

        // 轮换代理
        if (proxyDetails.length >= 2) {
          // 状态码 / 失败次数
          const switchByErrorCount =
            detailTargetConfig.proxy?.switchByErrorCount
          if (
            !isStatusNormal ||
            (!isUndefined(switchByErrorCount) &&
              switchByErrorCount >= crawlErrorQueue.length)
          ) {
            // 设置当前代理 URL 状态
            proxyDetails.find(
              (detail) => detail.url === detailTargetConfig.proxyUrl
            )!.state = false

            // 寻找新代理 URL
            const newProxyUrl = proxyDetails.find((detaile) => detaile.state)
              ?.url

            // 使用新代理 URL
            if (!isUndefined(newProxyUrl)) {
              detailTargetConfig.proxyUrl = newProxyUrl
            }
          }
        }
      }

      return isRetry
    })

    if (crawlQueue.length) {
      const retriedIds = crawlQueue.map((item) => {
        item.retryCount++

        return item.id
      })

      log(
        logWarn(
          `Start retrying - count: ${++i}, targets id: [ ${retriedIds.join(
            ', '
          )} ]`
        )
      )
    }
  }

  // 统计结果
  const succssIds: number[] = []
  const errorIds: number[] = []
  devices.forEach((device) => {
    if (device.isSuccess) {
      succssIds.push(device.id)
    } else {
      errorIds.push(device.id)
    }
  })

  log(logStatistics(`Crawl ${type}s finish:`))
  log(
    logSuccess(
      `  Success - total: ${succssIds.length}, targets id: [ ${succssIds.join(
        ', '
      )} ]`
    )
  )
  log(
    logError(
      `    Error - total: ${errorIds.length}, targets id: [ ${errorIds.join(
        ', '
      )} ]`
    )
  )

  return devices.map((device) => device.result)
}
