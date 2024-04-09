import path from 'node:path'
import { createCrawl, createCrawlOpenAI } from 'x-crawl'
import { fileURLToPath } from 'node:url'

import { BASE_URL, API_KEY } from './envConfig'

const pathResolve = (dirPath: string) =>
  fileURLToPath(new URL(dirPath, import.meta.url))

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { baseURL: BASE_URL, apiKey: API_KEY }
})

const crawlApp = createCrawl({
  crawlPage: { puppeteerLaunchOptions: { headless: true } }
})

crawlApp.crawlPage('https://www.airbnb.cn/s/select_homes').then(async (res) => {
  const { page, browser } = res.data

  // await page.waitForSelector('.g1nr81q6')
  // const sectionHTML = await page.$eval('.g1nr81q6 ', (el) => el.innerHTML)
  await page.waitForSelector(
    '.g1nr81q6 > a:nth-child(1), .g1nr81q6 > a:nth-child(2)'
  )
  const sectionHTML = await page.$$eval(
    '.g1nr81q6 > a:nth-child(1), .g1nr81q6 > a:nth-child(2) ',
    (els) => els.reduce((p, v) => p + v.innerHTML, '')
  )

  const srcResult = await crawlOpenAIApp.parseElements<{ src: string }>(
    sectionHTML,
    `获取 img 的 src`
  )

  console.log(srcResult)

  crawlApp.crawlFile({
    targets: srcResult.elements.map((item) => item.src),
    storeDirs: pathResolve('upload')
  })

  browser.close()
})
