// import path from 'node:path'
// import xCrawl from 'x-crawl'

// const testXCrawl = xCrawl({
//   timeout: 10000,
//   intervalTime: { max: 3000, min: 1000 },
//   proxy: 'http://localhost:14892'
// })

// testXCrawl
//   .crawlData({
//     requestConfigs: [
//       { url: '/room/597664', priority: 3 },
//       { url: '/room/92507', priority: 8 },
//       { url: '/room/193581217', priority: 3 }
//     ]
//   })
//   .then((res) => {
//     res.forEach((item) => {
//       console.log(item.data?.data.data.id)
//     })
//   })

// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 2000 } })

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 爬取 Page
  const res = await myXCrawl.crawlPage('https://www.bilibili.com/guochuang/')
  const { page } = res.data

  // 设置请求配置，获取轮播图片的 URL
  const requestConfigs = await page.$$eval('.chief-recom-item img', (imgEls) =>
    imgEls.map((item) => item.src)
  )

  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({
    requestConfigs,
    fileConfig: { storeDir: './upload' }
  })

  // 关闭页面
  page.close()
})
