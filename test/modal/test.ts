import process from 'node:process'
import path from 'node:path'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const currentModel = args[0]

let xCrawl: typeof IXCrawl
if (currentModel === 'dev') {
  xCrawl = require('../../src').default
} else if (currentModel === 'pro') {
  xCrawl = require('../../publish/dist')
}

jest.setTimeout(20000)

// API
async function crawlPageAPI() {
  const myXCrawl = xCrawl({ proxy: 'http://localhost:14892' })

  const res = await myXCrawl.crawlPage('https://docs.github.com/zh')
  const { browser } = res
  browser.close()

  return true
}

async function crawlDataAPI() {
  const myXCrawl = xCrawl()

  const res = await myXCrawl.crawlData({
    requestConfig: {
      url: 'http://localhost:9001/api/area/阳江市',
      method: 'POST',
      data: {
        type: 'goodPrice',
        offset: 0,
        size: 20
      }
    }
  })

  if (res[0].statusCode === 200) {
    return true
  } else {
    return false
  }
}

async function crawlFileAPI() {
  const myXCrawl = xCrawl({
    timeout: 10000,
    intervalTime: { max: 2000, min: 1000 },
    proxy: 'http://localhost:14892'
  })

  const requestConfig: string[] = [
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg'
  ]

  await myXCrawl.crawlFile({
    requestConfig,
    fileConfig: {
      storeDir: path.resolve(__dirname, './upload')
    }
  })

  return true
}

function startPollingAPI() {
  const myXCrawl = xCrawl()

  return new Promise((resolve) => {
    myXCrawl.startPolling({ m: 0.001 }, (count, stopPolling) => {
      if (count === 2) {
        stopPolling()
        resolve(true)
      }
    })
  })
}

test('crawlPage API', async () => {
  console.log(
    chalk.bgGreen('================ Start crawlPage API test ================')
  )
  await expect(crawlPageAPI()).resolves.toBe(true)
})

test('crawlData API', async () => {
  console.log(
    chalk.bgGreen('================ Start crawlData API test ================')
  )
  await expect(crawlDataAPI()).resolves.toBe(true)
})

test('crawlFile API', async () => {
  console.log(
    chalk.bgGreen('================ Start crawlFile API test ================')
  )
  await expect(crawlFileAPI()).resolves.toBe(true)
})

test('startPolling API', async () => {
  console.log(
    chalk.bgGreen(
      '================ Start startPolling API test ================'
    )
  )
  await expect(startPollingAPI()).resolves.toBe(true)
})
