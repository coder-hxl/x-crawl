import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { ExtraCommonConfig } from './api'
import { DetailInfo, CrawlDetail, getCrawlStatus } from './controller'

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
  for (const detailInfo of detailInfos) {
    const { id } = detailInfo

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    const crawlSinglePending = singleCrawlHandle(detailInfo, extraConfig)
      .catch((error) => {
        detailInfo.crawlErrorQueue.push(error)
        return false
      })
      .then((detailTargetRes) => {
        const notAllowRetry = detailInfo.retryCount === detailInfo.maxRetry

        if (typeof detailTargetRes === 'boolean') {
          if (notAllowRetry) {
            singleResultHandle(detailInfo, extraConfig)
          }

          return
        }

        detailInfo.isSuccess = true
        detailInfo.detailTargetRes = detailTargetRes

        // 根据 状态码/是否无法重试 决定处理结果
        const { detailTarget } = detailInfo

        const status = getCrawlStatus(detailTargetRes)
        const switchByHttpStatus = detailTarget.proxy?.switchByHttpStatus ?? []
        if ((status && !switchByHttpStatus.includes(status)) || notAllowRetry) {
          singleResultHandle(detailInfo, extraConfig)
          delete detailInfo._notHandle
        }
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

    // 根据 是否成功和状态码/是否无法重试 决定处理结果
    const { detailTarget, detailTargetRes } = detailInfo

    const status = getCrawlStatus(detailTargetRes)
    const switchByHttpStatus = detailTarget.proxy?.switchByHttpStatus ?? []
    const notAllowRetry = detailInfo.retryCount === detailInfo.maxRetry
    if (
      (detailInfo.isSuccess &&
        status &&
        !switchByHttpStatus.includes(status)) ||
      notAllowRetry
    ) {
      singleResultHandle(detailInfo, extraConfig)
      delete detailInfo._notHandle
    }
  }
}
