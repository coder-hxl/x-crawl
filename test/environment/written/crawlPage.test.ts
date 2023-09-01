import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from 'src/'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('src/').default
} else if (environment === 'pro') {
  xCrawl = require('publish/')
}

jest.setTimeout(60000)

/* 1.Written */
// 1.1.written string
async function writtenString() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlPage('https://gitee.com/coderhxl')

  await res.data.browser.close()

  return res.isSuccess
}

// 1.2.written CrawlPageDetailConfig
async function writtenCrawlPageDetailConfig() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlPage({
    url: 'https://github.com/coder-hxl/x-crawl'
  })

  await res.data.browser.close()

  return res.isSuccess
}

// 1.3.written (string | CrawlPageDetailConfig)[]
async function writtenStringAndCrawlPageDetailConfigArr() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlPage([
    'https://github.com/coder-hxl/x-crawl',
    { url: 'https://github.com/coder-hxl/x-crawl' }
  ])

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlPageAdvancedConfig
async function writtenCrawlPageAdvancedConfig() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlPage({
    targets: [
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
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testXCrawl.crawlPage(['/coder-hxl', '/coder-hxl/x-crawl'])

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testXCrawl = xCrawl({ baseUrl: 'https://github.com' })

  const res = await testXCrawl.crawlPage({
    targets: ['/coder-hxl', '/coder-hxl/x-crawl'],
    proxy: { urls: ['http://localhost:14892'] },
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

test('crawlPage - writtenCrawlPageDetailConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenCrawlPageDetailConfig ================'
    )
  )
  await expect(writtenCrawlPageDetailConfig()).resolves.toBe(true)
})

test('crawlPage - writtenStringAndCrawlPageDetailConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenStringAndCrawlPageDetailConfigArr ================'
    )
  )
  await expect(writtenStringAndCrawlPageDetailConfigArr()).resolves.toBe(true)
})

test('crawlPage - writtenCrawlPageAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - writtenCrawlPageAdvancedConfig ================'
    )
  )
  await expect(writtenCrawlPageAdvancedConfig()).resolves.toBe(true)
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

test('crawlPage - loaderAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlPage - loaderAdvancedConfig ================'
    )
  )
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})
