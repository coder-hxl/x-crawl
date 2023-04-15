import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('../../src').default
} else if (environment === 'pro') {
  xCrawl = require('../../publish/dist')
}

jest.setTimeout(60000)

/* 1.Written */
// 1.1.written string
async function writtenString() {
  const testXCrawl = xCrawl({ proxy: 'http://localohst:14892' })

  const res = await testXCrawl.crawlPage('https://github.com/coder-hxl/x-crawl')

  await res.data.browser.close()

  return res.isSuccess
}

// 1.2.written PageRequestConfig
async function writtenPageRequestConfig() {
  const testXCrawl = xCrawl({ proxy: 'http://localohst:14892' })

  const res = await testXCrawl.crawlPage({
    url: 'https://github.com/coder-hxl/x-crawl'
  })

  await res.data.browser.close()

  return res.isSuccess
}

// 1.3.written (string | DataRequestConfig)[]
async function writtenStringAndPageRequestConfigArr() {
  const testXCrawl = xCrawl({ proxy: 'http://localohst:14892' })

  const res = await testXCrawl.crawlPage([
    'https://github.com/coder-hxl/x-crawl',
    { url: 'https://github.com/coder-hxl/x-crawl' }
  ])

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlPageConfigObject
async function writtenCrawlPageConfigObject() {
  const testXCrawl = xCrawl({ proxy: 'http://localohst:14892' })

  const res = await testXCrawl.crawlPage({
    crawlPages: [
      'https://github.com/coder-hxl/x-crawl',
      { url: 'https://github.com/coder-hxl/x-crawl' }
    ]
  })

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 2.Loader Config */
// 2.1.Loader Base Config
async function loaderBaseConfig() {
  const testXCrawl = xCrawl({
    baseUrl: 'https://github.com',
    proxy: 'http://localhost:14892',
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testXCrawl.crawlPage(['/coder-hxl', '/coder-hxl/x-crawl'])

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader API Config
async function loaderAPIConfig() {
  const testXCrawl = xCrawl({ baseUrl: 'https://github.com' })

  const res = await testXCrawl.crawlPage({
    crawlPages: ['/coder-hxl', '/coder-hxl/x-crawl'],
    proxy: 'http://localhost:14892',
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 1.Written */
test('crawlPage - writtenString', async () => {
  console.log(
    chalk.bgGreen('================ crawlPage - writtenString ================')
  )
  await expect(writtenString()).resolves.toBe(true)
})

test('crawlPage - writtenPageRequestConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenPageRequestConfig ================'
    )
  )
  await expect(writtenPageRequestConfig()).resolves.toBe(true)
})

test('crawlPage - writtenStringAndPageRequestConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenStringAndPageRequestConfigArr ================'
    )
  )
  await expect(writtenStringAndPageRequestConfigArr()).resolves.toBe(true)
})

test('crawlPage - writtenCrawlPageConfigObject', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenCrawlPageConfigObject ================'
    )
  )
  await expect(writtenCrawlPageConfigObject()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlPage - loaderBaseConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - loaderBaseConfig ================'
    )
  )
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlPage - loaderAPIConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - loaderAPIConfig ================'
    )
  )
  await expect(loaderAPIConfig()).resolves.toBe(true)
})
