import xCrawl from 'x-crawl'
import sharp from 'sharp'
import path from 'path'

const testXCrawl = xCrawl({
  baseUrl:
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area',
  intervalTime: { max: 5000, min: 3000 }
})

testXCrawl
  .crawlFile({
    targets: ['/4401.jpg', '/4403.jpg', '/4404.jpg', '/4406.jpg', '/4407.jpg'],
    proxy: 'http://localhost:14892',
    storeDir: path.resolve(__dirname, './upload'),
    onBeforeSaveFile(info) {
      return sharp(info.data).resize(200).toBuffer()
    },
    onCrawlItemComplete(crawlFileSingleRes) {
      console.log(111, crawlFileSingleRes)
    }
  })
  .then(async (res) => {
    console.log(res)

    res.forEach((item) => {
      console.log(item.data?.data.isSuccess)
    })
  })
