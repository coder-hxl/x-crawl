import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

testXCrawl
  .crawlPage('https://www.npmjs.com/package/x-crawl?activeTab=versions')
  .then(async (res) => {
    const { page } = res

    await page.screenshot({
      path: path.resolve(__dirname, './upload/page.jpg')
    })

    console.log('完成')
  })
