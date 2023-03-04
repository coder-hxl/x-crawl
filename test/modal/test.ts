import process from 'node:process'
import path from 'node:path'
import { expect, test } from '@jest/globals'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const currentModel = args[0]

let xCrawl: typeof IXCrawl
if (currentModel === 'dev') {
  xCrawl = require('../../src').default
} else if (currentModel === 'pro') {
  xCrawl = require('../../publish/dist')
}

// Protocol

function httpProtocol() {
  return new Promise((resolve) => {
    const httpXCrawl = xCrawl()

    httpXCrawl
      .crawlData({
        requestConfig: 'http://localhost:9001/api/home/goodprice'
      })
      .then(() => resolve(true))
  })
}

function httpsProtocol() {
  return new Promise((resolve) => {
    const httpsXCrawl = xCrawl({
      timeout: 10000,
      proxy: 'http://localhost:14892'
    })

    httpsXCrawl
      .crawlPage('https://docs.github.com/zh')
      .then(() => resolve(true))
  })
}

test('http protocol', async () => {
  await expect(httpProtocol()).resolves.toBe(true)
})

test('https protocol', async () => {
  await expect(httpsProtocol()).resolves.toBe(true)
})

// API
function crawlPageAPI() {
  return new Promise((resolve) => {
    const myXCrawl = xCrawl()

    myXCrawl.crawlPage('https://docs.github.com/zh').then(() => resolve(true))
  })
}

function crawlDataAPI() {
  return new Promise((resolve) => {
    const myXCrawl = xCrawl()

    myXCrawl
      .crawlData({
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
      .then(() => resolve(true))
  })
}

function crawlFileAPI() {
  return new Promise((resolve) => {
    const myXCrawl = xCrawl({
      timeout: 10000,
      intervalTime: {
        max: 2000,
        min: 1000
      }
    })

    myXCrawl
      .crawlData({
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
      .then((res) => {
        const roomList = res[0].data.data.list
        const requestConfig: string[] = roomList.map(
          (item: any) => item.coverUrl
        )

        myXCrawl
          .crawlFile({
            requestConfig,
            fileConfig: {
              storeDir: path.resolve(__dirname, './upload')
            }
          })
          .then(() => resolve(true))
      })
  })
}

test('crawlPage API', async () => {
  await expect(crawlPageAPI()).resolves.toBe(true)
})

test('crawlData API', async () => {
  await expect(crawlDataAPI()).resolves.toBe(true)
})

test('crawlFile API', async () => {
  await expect(crawlFileAPI()).resolves.toBe(true)
})
