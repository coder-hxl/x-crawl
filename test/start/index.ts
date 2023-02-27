import path from 'node:path'
import XCrawl from '../../src'

const testXCrawl = XCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 },
  mode: 'async'
})

// testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
//   const { jsdom } = res.data

//   const imgEls =
//     jsdom.window.document.querySelectorAll<HTMLImageElement>(
//       '.timeline-box img'
//     )

//   let requestConifg: any[] = []

//   imgEls.forEach((item) => requestConifg.push({ url: `https:${item.src}` }))

//   requestConifg = requestConifg.splice(0, 30)

//   console.log(requestConifg)

//   testXCrawl.fetchFile({
//     requestConifg,
//     fileConfig: { storeDir: path.resolve(__dirname, 'upload') }
//   })
// })

testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
  console.log(1)
})

testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
  console.log(2)
})

testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
  console.log(3)
})
