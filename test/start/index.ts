import xCrawl from 'x-crawl'
import sharp from 'sharp'
import path from 'path'

const testXCrawl = xCrawl()

testXCrawl
  .crawlFile({
    crawlFiles: [
      'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg'
    ],
    proxy: 'http://localhost:14892',
    fileConfig: {
      storeDir: path.resolve(__dirname, './upload'),
      beforeSave(info) {
        return sharp(info.data).resize(200).toBuffer()
      }
    }
  })
  .then(async (res) => {
    res.forEach((item) => {
      console.log(item.data?.data.isSuccess)
    })
  })
