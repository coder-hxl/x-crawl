import path from 'node:path'
import xCrawl from 'x-crawl'

import { RequestConfig } from '../../publish/dist'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({
  timeout: 10000, // 请求超时时间
  intervalTime: { max: 3000, min: 2000 } // 控制请求频率
})

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ m: 1 }, (count, stopPolling) => {
  if (count >= 3) {
    return stopPolling()
  }

  // 调用 crawlPage API 爬取 Page
  myXCrawl.crawlPage('https://www.bilibili.com/guochuang/').then((res) => {
    const { jsdom } = res.data // 默认使用了 JSDOM 库解析 Page

    // 获取轮播图片元素
    const imgEls = jsdom.window.document.querySelectorAll<HTMLImageElement>(
      '.carousel-wrapper .chief-recom-item img'
    )

    // 设置请求配置
    const requestConfig: RequestConfig[] = []
    imgEls.forEach((item) => requestConfig.push(`https:${item.src}`))

    // 调用 crawlFile API 爬取图片
    myXCrawl.crawlFile({
      requestConfig,
      fileConfig: { storeDir: path.resolve(__dirname, './upload') }
    })
  })
})
const requestConfig: string[] = []
