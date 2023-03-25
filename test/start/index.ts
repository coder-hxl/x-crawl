import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

// testXCrawl
//   .crawlPage({ url: 'https://github.com/coder-hxl/x-crawl' })
//   .then(async (res) => {
//     const { page } = res

//     await page.screenshot({
//       path: path.resolve(__dirname, `./upload/page${res.id}.jpg`)
//     })

//     console.log(res.id, '完成')
//   })

const myXCrawl = xCrawl({
  timeout: 10000, // 请求超时时间
  intervalTime: { max: 3000, min: 2000 } // 爬取间隔时间
})

myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call crawlPage API to crawl Page
  const { page } = await myXCrawl.crawlPage(
    'https://zh.airbnb.com/s/*/plus_homes'
  )

  // set request configuration
  const requestConfig = await page.$$eval('picture img', (img) => {
    return img.map((item) => item.src)
  })

  // Call the crawlFile API to crawl pictures
  myXCrawl.crawlFile({ requestConfig, fileConfig: { storeDir: './upload' } })

  // Close page
  page.close()
})
