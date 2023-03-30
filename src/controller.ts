import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { IntervalTime } from './types/api'

export interface LoaderConfig<T, V> {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  errorQueue: Error[]
  requestConfig: T
  res: V | null
}

export async function controller<T extends { maxRetry?: number }, V>(
  mode: 'async' | 'sync',
  requestConfigs: T[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (loaderConfig: LoaderConfig<T, V>) => Promise<V>
): Promise<LoaderConfig<T, V>[]> {
  // 装载配置
  const loaderConfigs: LoaderConfig<T, V>[] = requestConfigs.map(
    (requestConfig, index) => ({
      id: index,
      isSuccess: false,
      maxRetry: requestConfig.maxRetry ?? 0,
      retryCount: -1,
      errorQueue: [],
      requestConfig,
      res: null
    })
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

  let crawlQueue: LoaderConfig<T, V>[] = loaderConfigs
  while (crawlQueue.length) {
    await batchCrawl(crawlQueue, intervalTime, crawlSingleFn)

    crawlQueue = crawlQueue.filter((config) =>
      !config.isSuccess && config.retryCount <= config.maxRetry ? true : false
    )
  }

  return loaderConfigs
}
