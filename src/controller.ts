import { asyncBatchCrawl, syncBatchCrawl } from './batchCrawlHandle'
import { IntervalTime } from './types/api'

export interface LoadConfig<T, V> {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  errorQueue: Error[]
  crawlConfig: T & { maxRetry: number }
  data: V | null
}

export type LoadConfigs<T, V> = LoadConfig<T, V>[]

export async function controller<T extends { maxRetry: number }, V>(
  mode: 'async' | 'sync',
  crawlConfigs: T[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (crawlConfig: T) => Promise<V>
): Promise<LoadConfigs<T, V>> {
  // 装载配置
  const loadConfigs: LoadConfigs<T, V> = crawlConfigs.map(
    (crawlConfig, index) => ({
      id: index,
      isSuccess: false,
      maxRetry: crawlConfig.maxRetry,
      retryCount: -1,
      errorQueue: [],
      crawlConfig,
      data: null
    })
  )

  // 选择爬取模式
  const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl

  let crawlQueue: LoadConfigs<T, V> = loadConfigs
  while (crawlQueue.length) {
    await batchCrawl(crawlQueue, intervalTime, crawlSingleFn)

    crawlQueue = crawlQueue.filter((config) =>
      !config.isSuccess && config.retryCount <= config.maxRetry ? true : false
    )
  }

  return loadConfigs
}
