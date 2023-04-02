import { isNumber, isUndefined, log, logNumber, random, sleep } from './utils'

import type { IntervalTime } from './types/api'
import type { ControllerConfig } from './controller'

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

export async function asyncBatchCrawl<T, V, C>(
  controllerConfigs: ControllerConfig<T, V>[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFnExtraConfig: C,
  crawlSingleFn: (
    controllerConfig: ControllerConfig<T, V>,
    crawlSingleFnExtraConfig: C
  ) => Promise<V>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  const crawlQueue: Promise<any>[] = []
  for (const controllerConfig of controllerConfigs) {
    const { id } = controllerConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    controllerConfig.crawlCount++

    const crawlSingle = crawlSingleFn(
      controllerConfig,
      crawlSingleFnExtraConfig
    )
      .catch((error) => {
        controllerConfig.errorQueue.push(error)
        return false
      })
      .then((crawlSingleRes) => {
        if (crawlSingleRes === false) return

        controllerConfig.isSuccess = true
        controllerConfig.crawlSingleRes = crawlSingleRes as V
      })

    crawlQueue.push(crawlSingle)
  }

  // 等待所有爬取结束
  await Promise.all(crawlQueue)
}

export async function syncBatchCrawl<T, V, C>(
  controllerConfigs: ControllerConfig<T, V>[],
  intervalTime: IntervalTime | undefined,
  crawlSingleFnExtraConfig: C,
  crawlSingleFn: (
    controllerConfig: ControllerConfig<T, V>,
    crawlSingleFnExtraConfig: C
  ) => Promise<V>
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberIntervalTime = isNumber(intervalTime)

  for (const controllerConfig of controllerConfigs) {
    const { id } = controllerConfig

    await useSleepByBatch(
      isHaventervalTime,
      isNumberIntervalTime,
      intervalTime,
      id
    )

    controllerConfig.crawlCount++

    try {
      controllerConfig.crawlSingleRes = await crawlSingleFn(
        controllerConfig,
        crawlSingleFnExtraConfig
      )
      controllerConfig.isSuccess = true
    } catch (error: any) {
      controllerConfig.errorQueue.push(error)
    }
  }
}
