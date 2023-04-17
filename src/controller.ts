import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { priorityQueueMergeSort } from './sort'

import {
  LoaderCrawlDataDetail,
  LoaderCrawlFileDetail,
  LoaderCrawlPageDetail
} from './api'

import { IntervalTime } from './types/api'
import { log, logError, logNumber, logSuccess, logWarn } from './utils'

export type CrawlDetail =
  | LoaderCrawlPageDetail
  | LoaderCrawlDataDetail
  | LoaderCrawlFileDetail

export interface ControllerConfig<T extends CrawlDetail, V> {
  id: number
  isSuccess: boolean
  crawlCount: number
  maxRetry: number
  errorQueue: Error[]
  crawlDetailConfig: T
  crawlSingleRes: V | null
}

export async function controller<T extends CrawlDetail, V, C>(
  name: 'page' | 'data' | 'file',
  mode: 'async' | 'sync',
  crawlDetails: T[],
  crawlSingleFnExtra: C,
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (
    controllerConfig: ControllerConfig<T, V>,
    crawlSingleFnExtra: C
  ) => Promise<V>
): Promise<ControllerConfig<T, V>[]> {
  // 是否使用优先爬取
  const isPriorityCrawl = !crawlDetails.every(
    (item) => item.priority === crawlDetails[0].priority
  )
  const targetRequestConfigs = isPriorityCrawl
    ? priorityQueueMergeSort(
        crawlDetails.map((item) => ({
          ...item,
          valueOf: () => item.priority
        }))
      )
    : crawlDetails

  // 通过映射生成新的配置数组
  const controllerConfigs: ControllerConfig<T, V>[] = targetRequestConfigs.map(
    (crawlDetailConfig, index) => ({
      id: index + 1,
      isSuccess: false,
      maxRetry: crawlDetailConfig.maxRetry,
      crawlCount: 0,
      errorQueue: [],
      crawlDetailConfig,
      crawlSingleRes: null
    })
  )

  log(
    `${logSuccess(`Start crawling`)} - name: ${logWarn(name)}, mode: ${logWarn(
      mode
    )}, total: ${logNumber(controllerConfigs.length)} `
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

  let i = 0
  let crawlQueue: ControllerConfig<T, V>[] = controllerConfigs
  while (crawlQueue.length) {
    await batchCrawl(
      crawlQueue,
      crawlSingleFnExtra,
      intervalTime,
      crawlSingleFn
    )

    crawlQueue = crawlQueue.filter(
      (config) =>
        config.maxRetry &&
        !config.isSuccess &&
        config.crawlCount <= config.maxRetry
    )

    if (crawlQueue.length) {
      const retriedIds = crawlQueue.map((item) => item.id)
      log(
        logWarn(`Retry: ${++i} - Ids to retry: [ ${retriedIds.join(' - ')} ]`)
      )
    }
  }

  // 统计结果
  const succssIds: number[] = []
  const errorIds: number[] = []
  controllerConfigs.forEach((item) => {
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

  return controllerConfigs
}
