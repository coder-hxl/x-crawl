import path from 'node:path'
import XCrawl from '../../src'

const testXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: {
    max: 3000,
    min: 2000
  }
})

// testXCrawl
//   .fetchData({
//     requestConifg: [
//       { url: 'http://localhost:3001/home' },
//       { url: 'http://localhost:9001/api/home/goodprice' },
//       { url: 'http://localhost:3001/home' },
//       { url: 'http://localhost:9001/ai/home/goodprice' }
//     ]
//   })
//   .then((res) => {
//     console.log(res)
//   })

testXCrawl.fetchHTML({ url: 'https://www.bilibili.com/' }).then((jsdom) => {
  const document = jsdom.window.document
  const imgBoxEl = document.querySelectorAll('.bili-video-card__cover')

  const imgUrls: string[] = []
  imgBoxEl.forEach((item, index) => {
    const img = item.lastChild as HTMLImageElement

    if (index % 2) {
      imgUrls.push('https:' + img.src)
    } else {
      imgUrls.push(img.src)
    }
  })

  console.log(imgUrls)

  const requestConifg = imgUrls.map((url) => ({ url }))

  testXCrawl
    .fetchFile({
      requestConifg,
      fileConfig: { storeDir: path.resolve(__dirname, './upload') }
    })
    .then((res) => {
      console.log(res)
    })
})
