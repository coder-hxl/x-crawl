import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { priorityQueueMergeSort } from './sort'

import {
  ExtraCommonConfig,
  LoaderCrawlDataDetail,
  LoaderCrawlFileDetail,
  LoaderCrawlPageDetail
} from './api'

import { log, logError, logNumber, logSuccess, logWarn } from './utils'

export type CrawlDetail =
  | LoaderCrawlPageDetail
  | LoaderCrawlDataDetail
  | LoaderCrawlFileDetail

export interface DetailInfo<T extends CrawlDetail, R> {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  crawlErrorQueue: Error[]
  data: any | null

  detailTarget: T
  detailTargetRes: R | null
}

type TargetSingleRes = Omit<
  DetailInfo<any, any>,
  'detailTarget' | 'detailTargetRes'
>

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
      id: index + 1,
      isSuccess: false,
      maxRetry: detailTarget.maxRetry,
      retryCount: 0,
      crawlErrorQueue: [],
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

    crawlQueue = crawlQueue.filter(
      (config) =>
        config.maxRetry &&
        !config.isSuccess &&
        config.retryCount < config.maxRetry
    )

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
