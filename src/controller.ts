import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { priorityQueueMergeSort } from './sort'
import {
  IntervalTime,
  LoaderDataRequestConfig,
  LoaderFileRequestConfig,
  LoaderPageRequestConfig
} from './types/api'
import { log, logError, logNumber, logSuccess, logWarn } from './utils'

export interface ControllerConfig<
  T extends
    | LoaderPageRequestConfig
    | LoaderDataRequestConfig
    | LoaderFileRequestConfig,
  V
> {
  id: number
  isSuccess: boolean
  crawlCount: number
  maxRetry: number
  errorQueue: Error[]
  requestConfig: T
  crawlSingleRes: V | null
}

export async function controller<
  T extends
    | LoaderPageRequestConfig
    | LoaderDataRequestConfig
    | LoaderFileRequestConfig,
  V,
  C
>(
  name: 'page' | 'data' | 'file',
  mode: 'async' | 'sync',
  requestConfigs: T[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFnExtraConfig: C,
  crawlSingleFn: (
    controllerConfig: ControllerConfig<T, V>,
    crawlSingleFnExtraConfig: C
  ) => Promise<V>
): Promise<ControllerConfig<T, V>[]> {
  // 是否使用优先爬取
  const isPriorityCrawl = !requestConfigs.every(
    (item) => item.priority === requestConfigs[0].priority
  )
  const targetRequestConfigs = isPriorityCrawl
    ? priorityQueueMergeSort(
        requestConfigs.map((item) => ({
          ...item,
          valueOf: () => item.priority
        }))
      )
    : requestConfigs

  // 通过映射生成新的配置数组
  const controllerConfigs: ControllerConfig<T, V>[] = targetRequestConfigs.map(
    (requestConfig, index) => ({
      id: index + 1,
      isSuccess: false,
      maxRetry: requestConfig.maxRetry,
      crawlCount: 0,
      errorQueue: [],
      requestConfig,
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
      intervalTime,
      crawlSingleFnExtraConfig,
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
