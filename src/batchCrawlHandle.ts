import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { IntervalTime } from './types/api'
import type { LoadConfigs } from './controller'

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
  loadConfigs: LoadConfigs<T, V>,
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (crawlConfig: T) => Promise<any>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlQueue: Promise<any>[] = []
  for (const loadConfig of loadConfigs) {
    const { id } = loadConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    loadConfig.retryCount++

    const crawlSingle = crawlSingleFn(loadConfig.crawlConfig)
      .catch((error) => {
        loadConfig.errorQueue.push(error)
        return false
      })
      .then((res) => {
        if (res === false) return

        loadConfig.isSuccess = true
        loadConfig.data = res
      })

    crawlQueue.push(crawlSingle)
  }

  // 等待所有爬取结束
  await Promise.all(crawlQueue)
}

export async function syncBatchCrawl<T, V>(
  loadConfigs: LoadConfigs<T, V>,
  intervalTime: IntervalTime | undefined,
  crawlSingleFn: (crawlConfig: T) => Promise<any>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const loadConfig of loadConfigs) {
    const { id } = loadConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    loadConfig.retryCount++

    try {
      const crawlSingleRes = await crawlSingleFn(loadConfig.crawlConfig)
      loadConfig.isSuccess = true
      loadConfig.data = crawlSingleRes
    } catch (error: any) {
      loadConfig.errorQueue.push(error)
    }
  }
}
