import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  maxRetry: 3,
  intervalTime: { max: 3000, min: 2000 }
})

myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 爬取 Page
  const res = await myXCrawl.crawlPage([
    'https://www.bilibili.com',
    'https://www.bilibili.com/guochuang',
    'https://www.bilibili.com/movie'
  ])

  // 获取每个页面轮播图片的 URL
  const imgUrls: string[] = []
  const elSelectorMap = [
    '.carousel-inner img',
    '.chief-recom-item img',
    '.bg-item img'
  ]
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    const urls = await page.$$eval(elSelectorMap[id - 1] as 'img', (imgEls) =>
      imgEls.map((item) => item.src)
    )
    imgUrls.push(...urls)

    // 关闭页面
    page.close()
  }

  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({
    requestConfigs: imgUrls,
    fileConfig: { storeDir: './upload' }
  })
})
