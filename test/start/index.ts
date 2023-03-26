import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

testXCrawl
  .crawlPage([
    'https://github.com/coder-hxl',
    'https://github.com/coder-hxl/x-crawl'
  ])
  .then(async (res) => {
    res.forEach(async (item) => {
      const { page } = item

      await page.screenshot({
        path: path.resolve(__dirname, `./upload/page${item.id}.jpg`)
      })

      console.log(item.id, '完成')
    })
  })
