import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { ExtraCommonConfig } from './api'
import { CrawlDetail, Device } from './controller'

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

    log(`Target id: ${logNumber(id)} - sleep: ${logNumber(timeout + 'ms')}`)

    await sleep(timeout)
  } else {
    log(`Target id: ${logNumber(id)} - sleep: ${logNumber('0ms')}`)
  }
}

export async function asyncBatchCrawl<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  devices: Device<T, R>[],
  extraConfig: E,
  singleCrawlHandle: (device: Device<T, R>, extraConfig: E) => Promise<R>
) {
  const { intervalTime } = extraConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlPendingQueue: Promise<any>[] = []
  for (const device of devices) {
    const { id } = device

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    crawlPendingQueue.push(singleCrawlHandle(device, extraConfig))
  }

  // 等待所有爬取结束
  await Promise.all(crawlPendingQueue)
}

export async function syncBatchCrawl<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  devices: Device<T, R>[],
  extraConfig: E,
  singleCrawlHandle: (device: Device<T, R>, extraConfig: E) => Promise<R>
) {
  const { intervalTime } = extraConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const device of devices) {
    const { id } = device

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    await singleCrawlHandle(device, extraConfig)
  }
}
