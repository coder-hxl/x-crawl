import process from 'node:process'
import path from 'node:path'
import { expect, test } from '@jest/globals'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const currentModel = args[0]

let XCrawl: typeof IXCrawl
if (currentModel === 'dev') {
  XCrawl = require('../../src').default
} else if (currentModel === 'pro') {
  XCrawl = require('../../publish/dist')
}

// Protocol

function httpProtocol() {
  return new Promise((resolve) => {
    const httpXCrawl = XCrawl()

    httpXCrawl
      .fetchData({
        requestConfig: {
          url: 'http://localhost:9001/api/home/goodprice'
        }
      })
      .then(() => resolve(true))
  })
}

function httpsProtocol() {
  return new Promise((resolve) => {
    const httpsXCrawl = XCrawl({ timeout: 10000 })

    httpsXCrawl
      .fetchPage('https://docs.github.com/zh')
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
function fetchPageAPI() {
  return new Promise((resolve) => {
    const myXCrawl = XCrawl()

    myXCrawl.fetchPage('https://docs.github.com/zh').then(() => resolve(true))
  })
}

function fetchDataAPI() {
  return new Promise((resolve) => {
    const myXCrawl = XCrawl()

    myXCrawl
      .fetchData({
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

function fetchFileAPI() {
  return new Promise((resolve) => {
    const myXCrawl = XCrawl({
      timeout: 10000,
      intervalTime: {
        max: 2000,
        min: 1000
      }
    })

    myXCrawl
      .fetchData({
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
        const requestConfig = roomList.map((item: any) => ({
          url: item.coverUrl
        }))

        myXCrawl
          .fetchFile({
            requestConfig,
            fileConfig: {
              storeDir: path.resolve(__dirname, './upload')
            }
          })
          .then(() => resolve(true))
      })
  })
}

test('fetchPage API', async () => {
  await expect(fetchPageAPI()).resolves.toBe(true)
})

test('fetchData API', async () => {
  await expect(fetchDataAPI()).resolves.toBe(true)
})

test('fetchFile API', async () => {
  await expect(fetchFileAPI()).resolves.toBe(true)
})
