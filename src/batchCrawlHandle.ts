import { quickSort } from './sort'
import {
  isNumber,
  isUndefined,
  log,
  logError,
  logNumber,
  logSuccess,
  logWarn,
  random,
  sleep
} from './utils'

import { IntervalTime } from './types/api'
import { AnyObject } from './types/common'

async function useSleepByBatch(
  isHaventervalTime: boolean,
  isNumberntervalTime: boolean,
  intervalTime: any,
  id: number
) {
  if (isHaventervalTime && id > 1) {
    const timeout: number = isNumberntervalTime
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

type BatchHandleResItem<V> = V & { id: number }

async function asyncBatchCrawlHandle<T, V extends AnyObject>(
  name: string,
  handleConfigs: T[],
  intervalTime: IntervalTime | undefined,
  handleFn: (handleConfig: T) => Promise<any>,
  callback: (handleResItem: BatchHandleResItem<V>) => void
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberntervalTime = isNumber(intervalTime)

  log(
    `${logSuccess(`Start crawling:`)} name: ${logWarn(name)}, mode: ${logWarn(
      'async'
    )}, total: ${logNumber(handleConfigs.length)} `
  )

  let index = 0
  let successTotal = 0
  let errorTotal = 0
  const requestQueue: Promise<void>[] = []
  const errorMessage: { message: string; valueOf: () => number }[] = []
  for (const handleConfig of handleConfigs) {
    const id = ++index

    await useSleepByBatch(
      isHaventervalTime,
      isNumberntervalTime,
      intervalTime,
      id
    )

    const handleItem = handleFn(handleConfig)
      .catch((error: any) => {
        errorTotal++

        const message = `Crawl ${id} is an error: ${error.message}`
        const valueOf = () => id

        errorMessage.push({ message, valueOf })
      })
      .then((handleResItem) => {
        if (!handleResItem) return

        successTotal++
        callback({ id, ...handleResItem })
      })

    requestQueue.push(handleItem)
  }

  log(logSuccess('All crawls ended!'))

  // 等待所有请求结束
  await Promise.all(requestQueue)

  // 排序后打印错误消息
  quickSort(errorMessage).forEach((item) => log(logError(item.message)))

  log(
    `Total crawls: ${logNumber(handleConfigs.length)}, success: ${logSuccess(
      successTotal
    )}, error: ${logError(errorTotal)}`
  )
}

async function syncBatchCrawlHandle<T, V extends AnyObject>(
  name: string,
  handleConfigs: T[],
  intervalTime: IntervalTime | undefined,
  handleFn: (handleConfig: T) => Promise<any>,
  callback: (handleResItem: BatchHandleResItem<V>) => void
) {
  const isHaventervalTime = !isUndefined(intervalTime)
  const isNumberntervalTime = isNumber(intervalTime)

  log(
    `${logSuccess(`Start crawling:`)} name: ${logWarn(name)}, mode: ${logWarn(
      'sync'
    )}, total: ${logNumber(handleConfigs.length)}`
  )

  let id = 0
  let successTotal = 0
  let errorTotal = 0
  for (const handleConfig of handleConfigs) {
    id++

    await useSleepByBatch(
      isHaventervalTime,
      isNumberntervalTime,
      intervalTime,
      id
    )

    let isRequestSuccess = true
    let handleResItem: BatchHandleResItem<V> | null = null
    try {
      const requestRes = await handleFn(handleConfig)
      handleResItem = { id, ...requestRes }
      log(logSuccess(`Crawl ${logNumber(id)} is an success`))
      successTotal++
    } catch (error: any) {
      isRequestSuccess = false
      log(logError(`Crawl ${id} is an error: ${error.message}`))
      errorTotal++
    }

    if (isRequestSuccess && handleResItem) {
      callback(handleResItem)
    }
  }

  log(logSuccess('All crawls ended!'))

  log(
    `Total crawls: ${logNumber(handleConfigs.length)}, success: ${logSuccess(
      successTotal
    )}, error: ${logError(errorTotal)}`
  )
}

export async function useBatchCrawlHandleByMode<T, V extends AnyObject>(
  name: string,
  mode: 'async' | 'sync',
  handleConfigs: T[],
  intervalTime: IntervalTime | undefined,
  handleFn: (handleConfig: T) => Promise<V>,
  callback: (handleResItem: BatchHandleResItem<V>) => void
) {
  if (mode === 'async') {
    await asyncBatchCrawlHandle(
      name,
      handleConfigs,
      intervalTime,
      handleFn,
      callback
    )
  } else {
    await syncBatchCrawlHandle(
      name,
      handleConfigs,
      intervalTime,
      handleFn,
      callback
    )
  }
}
