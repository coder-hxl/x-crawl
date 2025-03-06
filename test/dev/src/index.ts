import { createCrawl, createCrawlOpenAI } from 'x-crawl'

import { BASE_URL, API_KEY } from './envConfig'
import { pathResolve } from './utils'

const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { baseURL: BASE_URL, apiKey: API_KEY },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage 用于爬取页面
crawlApp.crawlPage('https://www.example.cn/s/select_homes').then(async (res) => {
  const { page, browser } = res.data

  // 等待元素出现在页面中, 并获取 HTML
  const targetSelector = '[data-tracking-id="TOP_REVIEWED_LISTINGS"]'
  await page.waitForSelector(targetSelector)
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML)

  // 让 AI 获取图片链接, 并去重
  const srcResult = await crawlOpenAIApp.parseElements(
    highlyHTML,
    '获取图片链接, 不要source里面的, 并去重'
  )

  browser.close()

  // crawlFile 用于爬取文件资源
  crawlApp.crawlFile({
    targets: srcResult.elements.map((item) => item.src),
    storeDirs: pathResolve('./upload')
  })
})
