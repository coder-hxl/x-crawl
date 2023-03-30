import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { IntervalTime } from './types/api'
import type { LoaderConfig } from './controller'

async function useSleepByBatch(
  isHaventervalTime: boolean,
  isNumberIntervalTime: boolean,
  intervalTime: any,
  id: number
) {
  if (isHaventervalTime && id > 1) {
    const timeout: number = isNumberIntervalTime
      ? intervalTime
      : random(intervalTime.max, intervalTime.min)

    log(
      `Crawl ${logNumber(id)} needs to sleep for ${logNumber(
        timeout + 'ms'
      )} milliseconds before sending`
    )

    await sleep(timeout)
  } else {
    log(`Crawl ${logNumber(id)} does not need to sleep, send immediately`)
  }
}

export async function asyncBatchCrawl<T, V>(
  loaderConfigs: LoaderConfig<T, V>[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (loaderConfig: LoaderConfig<T, V>) => Promise<any>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlQueue: Promise<any>[] = []
  for (const loaderConfig of loaderConfigs) {
    const { id } = loaderConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    loaderConfig.retryCount++

    const crawlSingle = crawlSingleFn(loaderConfig)
      .catch((error) => {
        loaderConfig.errorQueue.push(error)
        return false
      })
      .then((res) => {
        if (res === false) return

        loaderConfig.isSuccess = true
        loaderConfig.res = res
      })

    crawlQueue.push(crawlSingle)
  }

  // 等待所有爬取结束
  await Promise.all(crawlQueue)
}

export async function syncBatchCrawl<T, V>(
  loaderConfigs: LoaderConfig<T, V>[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (loaderConfig: LoaderConfig<T, V>) => Promise<any>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const loaderConfig of loaderConfigs) {
    const { id } = loaderConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    loaderConfig.retryCount++

    try {
      const crawlSingleRes = await crawlSingleFn(loaderConfig)
      loaderConfig.isSuccess = true
      loaderConfig.res = crawlSingleRes
    } catch (error: any) {
      loaderConfig.errorQueue.push(error)
    }
  }
}
