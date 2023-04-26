import process from 'node:process'
import { expect, test } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from 'src/'


const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('src/').default
} else if (environment === 'pro') {
  xCrawl = require('publish/dist')
}

function startPolling() {
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

test('startPolling', async () => {
  console.log(chalk.bgGreen('================ startPolling ================'))
  await expect(startPolling()).resolves.toBe(true)
})
