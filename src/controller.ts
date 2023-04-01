import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { IntervalTime } from './types/api'

export interface ControllerConfig<T, V> {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  errorQueue: Error[]
  requestConfig: T
  crawlSingleRes: V | null
}

export async function controller<T extends { maxRetry?: number }, V, C>(
  mode: 'async' | 'sync',
  requestConfigs: T[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFnExtraConfig: C,
  crawlSingleFn: (
    controllerConfig: ControllerConfig<T, V>,
    crawlSingleFnExtraConfig: C
  ) => Promise<V>
): Promise<ControllerConfig<T, V>[]> {
  // 通过映射生成新的配置数组
  const controllerConfigs: ControllerConfig<T, V>[] = requestConfigs.map(
    (requestConfig, index) => ({
      id: index + 1,
      isSuccess: false,
      maxRetry: requestConfig.maxRetry ?? 0,
      retryCount: -1,
      errorQueue: [],
      requestConfig,
      crawlSingleRes: null
    })
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

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
        config.retryCount < config.maxRetry
    )
  }

  return controllerConfigs
}
