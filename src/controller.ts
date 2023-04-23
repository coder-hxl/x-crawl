import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { priorityQueueMergeSort } from './sort'

import {
  ExtraCommonConfig,
  LoaderCrawlDataDetail,
  LoaderCrawlFileDetail,
  LoaderCrawlPageDetail,
  ProxyDetails
} from './api'

import {
  isObject,
  isUndefined,
  log,
  logError,
  logNumber,
  logSuccess,
  logWarn
} from './utils'
import { HTTPResponse } from 'puppeteer'
import { Request } from './request'

export type CrawlDetail =
  | LoaderCrawlPageDetail
  | LoaderCrawlDataDetail
  | LoaderCrawlFileDetail

export interface DetailInfo<T extends CrawlDetail, R> {
  _notHandle: any

  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  crawlErrorQueue: Error[]
  proxyDetailes: ProxyDetails
  data: any | null

  detailTarget: T
  detailTargetRes: R | null
}

type TargetSingleRes = Omit<
  DetailInfo<any, any>,
  'detailTarget' | 'detailTargetRes'
>

export function getCrawlStatus(detailTargetRes: any) {
  let status: number | null = null

  if (
    isObject(detailTargetRes) &&
    Object.hasOwn(detailTargetRes, 'response') &&
    (detailTargetRes as any).response
  ) {
    // crawlPage
    const response: HTTPResponse = (detailTargetRes as any).response
    status = response.status()
  } else if (isObject(detailTargetRes)) {
    // crawlData / crawlFie
    status = (detailTargetRes as any as Request).statusCode ?? null
  }

  return status
}

export async function controller<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  name: 'page' | 'data' | 'file',
  mode: 'async' | 'sync',
  detailTargets: T[],
  extraConfig: E,
  singleCrawlHandle: (
    detailInfo: DetailInfo<T, R>,
    extraConfig: E
  ) => Promise<R>,
  singleResultHandle: (detailInfo: DetailInfo<T, R>, extraConfig: E) => void
): Promise<TargetSingleRes[]> {
  // 是否使用优先爬取
  const isPriorityCrawl = !detailTargets.every(
    (item) => item.priority === detailTargets[0].priority
  )
  const detailTargetConfigs = isPriorityCrawl
    ? priorityQueueMergeSort(
        detailTargets.map((item) => ({
          ...item,
          valueOf: () => item.priority
        }))
      )
    : detailTargets

  // 通过映射生成新的配置数组
  const detailInfos: DetailInfo<T, R>[] = detailTargetConfigs.map(
    (detailTarget, index) => ({
      _notHandle: true,

      id: index + 1,
      isSuccess: false,
      maxRetry: detailTarget.maxRetry,
      retryCount: 0,
      crawlErrorQueue: [],
      proxyDetailes: detailTarget.proxyDetails,
      data: null,

      detailTarget,
      detailTargetRes: null
    })
  )

  log(
    `${logSuccess(`Start crawling`)} - name: ${logWarn(name)}, mode: ${logWarn(
      mode
    )}, total: ${logNumber(detailInfos.length)} `
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

  let i = 0
  let crawlQueue: DetailInfo<T, R>[] = detailInfos
  while (crawlQueue.length) {
    await batchCrawl(
      crawlQueue,
      extraConfig,
      singleCrawlHandle,
      singleResultHandle
    )

    crawlQueue = crawlQueue.filter((detailInfo) => {
      const {
        isSuccess,
        maxRetry,
        retryCount,
        proxyDetailes,
        crawlErrorQueue,
        detailTarget,
        detailTargetRes
      } = detailInfo

      let isRetry = false
      const haveRetryChance = maxRetry && retryCount < maxRetry

      // 没有被处理/没成功/状态码不符合
      if (Object.hasOwn(detailInfo, '_notHandle') && haveRetryChance) {
        // 1.不成功
        if (!isSuccess) {
          isRetry = true
        }

        // 2.代理多, 轮换代理
        if (proxyDetailes.length >= 2) {
          // 获取状态码
          const status = getCrawlStatus(detailTargetRes)

          // 错误次数 / 检测状态码
          const switchByErrorCount = detailTarget.proxy?.switchByErrorCount ?? 0
          const switchByHttpStatus =
            detailTarget.proxy?.switchByHttpStatus ?? []
          if (
            (status && switchByHttpStatus.includes(status)) ||
            switchByErrorCount >= crawlErrorQueue.length
          ) {
            isRetry = true
            proxyDetailes.find(
              (detail) => detail.url === detailTarget.proxyUrl
            )!.state = false

            // 寻找新代理 URL
            const newProxyUrl = proxyDetailes.find(
              (detaile) => detaile.state
            )?.url

            // 无则不切换
            if (!isUndefined(newProxyUrl)) {
              detailTarget.proxyUrl = newProxyUrl
            }
          }
        }
      }

      // 重置需要重试的 isSuccess
      if (isRetry) {
        detailInfo.isSuccess = false
      }

      return isRetry
    })

    if (crawlQueue.length) {
      const retriedIds = crawlQueue.map((item) => {
        item.retryCount++

        return item.id
      })
      log(
        logWarn(`Retry: ${++i} - Ids to retry: [ ${retriedIds.join(' - ')} ]`)
      )
    }
  }

  // 统计结果
  const succssIds: number[] = []
  const errorIds: number[] = []
  detailInfos.forEach((item) => {
    if (item.isSuccess) {
      succssIds.push(item.id)
    } else {
      errorIds.push(item.id)
    }
  })

  log('Crawl the final result:')
  log(
    logSuccess(
      `  Success - total: ${succssIds.length}, ids: [ ${succssIds.join(
        ' - '
      )} ]`
    )
  )
  log(
    logError(
      `    Error - total: ${errorIds.length}, ids: [ ${errorIds.join(' - ')} ]`
    )
  )

  return detailInfos as TargetSingleRes[]
}
