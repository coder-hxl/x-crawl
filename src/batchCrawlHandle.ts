import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { ExtraCommonConfig } from './api'
import type { DetailInfo, CrawlDetail } from './controller'

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
      `Id: ${logNumber(id)} - Crawl needs to sleep for ${logNumber(
        timeout + 'ms'
      )} milliseconds before sending`
    )

    await sleep(timeout)
  } else {
    log(`Id: ${logNumber(id)} - Crawl does not need to sleep, send immediately`)
  }
}

export async function asyncBatchCrawl<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  detailInfos: DetailInfo<T, R>[],
  extraConfig: E,
  singleCrawlHandle: (
    detailInfo: DetailInfo<T, R>,
    extraConfig: E
  ) => Promise<R>,
  singleResultHandle: (detailInfo: DetailInfo<T, R>, extraConfig: E) => void
) {
  const { intervalTime } = extraConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlPendingQueue: Promise<any>[] = []
  for (const detaileInfo of detailInfos) {
    const { id } = detaileInfo

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    const crawlSinglePending = singleCrawlHandle(detaileInfo, extraConfig)
      .catch((error) => {
        detaileInfo.crawlErrorQueue.push(error)
        return false
      })
      .then((detailTargetRes) => {
        if (typeof detailTargetRes === 'boolean') {
          if (detaileInfo.retryCount === detaileInfo.maxRetry) {
            singleResultHandle(detaileInfo, extraConfig)
          }

          return
        }

        detaileInfo.isSuccess = true
        detaileInfo.detailTargetRes = detailTargetRes

        singleResultHandle(detaileInfo, extraConfig)
      })

    crawlPendingQueue.push(crawlSinglePending)
  }

  // 等待所有爬取结束
  await Promise.all(crawlPendingQueue)
}

export async function syncBatchCrawl<
  T extends CrawlDetail,
  E extends ExtraCommonConfig,
  R
>(
  detailInfos: DetailInfo<T, R>[],
  extraConfig: E,
  singleCrawlHandle: (
    detaileInfo: DetailInfo<T, R>,
    extraConfig: E
  ) => Promise<R>,
  singleResultHandle: (detaileInfo: DetailInfo<T, R>, extraConfig: E) => void
) {
  const { intervalTime } = extraConfig

  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const detailInfo of detailInfos) {
    const { id } = detailInfo

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    try {
      detailInfo.detailTargetRes = await singleCrawlHandle(
        detailInfo,
        extraConfig
      )
      detailInfo.isSuccess = true
    } catch (error: any) {
      detailInfo.crawlErrorQueue.push(error)
    }

    if (detailInfo.isSuccess || detailInfo.retryCount === detailInfo.maxRetry) {
      singleResultHandle(detailInfo, extraConfig)
    }
  }
}
