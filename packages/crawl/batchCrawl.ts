import {
  isNumber,
  isUndefined,
  log,
  logNumber,
  random,
  sleep,
  whiteBold
} from '../shared'

import type { InfoCommonConfig } from './api'
import { CrawlDetail, Device } from './controller'

async function useSleepByBatch<T extends InfoCommonConfig>(
  isHaventervalTime: boolean,
  isNumberIntervalTime: boolean,
  intervalTime: any,
  id: number,
  infoConfig: T
) {
  const { serialNumber, logConfig } = infoConfig

  if (isHaventervalTime && id > 1) {
    const timeout: number = isNumberIntervalTime
      ? intervalTime
      : random(intervalTime.max, intervalTime.min)

    if (logConfig.process) {
      log(
        `${whiteBold(serialNumber)} | Target id: ${logNumber(
          id
        )} - Sleep time: ${logNumber(timeout + 'ms')}`
      )
    }

    await sleep(timeout)
  } else if (logConfig.process) {
    log(
      `${whiteBold(serialNumber)} | Target id: ${logNumber(
        id
      )} - Sleep time: ${logNumber('0ms')}`
    )
  }
}

export async function asyncBatchCrawl<
  T extends CrawlDetail,
  I extends InfoCommonConfig,
  R
>(
  devices: Device<T, R>[],
  infoConfig: I,
  singleCrawlHandle: (device: Device<T, R>, infoConfig: I) => Promise<void>
) {
  const { intervalTime } = infoConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlPendingQueue: Promise<any>[] = []
  for (const device of devices) {
    const { id } = device

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id,
      infoConfig
    )

    crawlPendingQueue.push(singleCrawlHandle(device, infoConfig))
  }

  // 等待所有爬取结束
  await Promise.all(crawlPendingQueue)
}

export async function syncBatchCrawl<
  T extends CrawlDetail,
  I extends InfoCommonConfig,
  R
>(
  devices: Device<T, R>[],
  infoConfig: I,
  singleCrawlHandle: (device: Device<T, R>, infoConfig: I) => Promise<void>
) {
  const { intervalTime } = infoConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const device of devices) {
    const { id } = device

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id,
      infoConfig
    )

    await singleCrawlHandle(device, infoConfig)
  }
}
