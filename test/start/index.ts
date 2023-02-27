import path from 'node:path'
import XCrawl from '../../src'

const testXCrawl = XCrawl({
  timeout: 10000,
  intervalTime: { max: 0, min: 0 },
  mode: 'async'
})

// testXCrawl.fetchData({
//   requestConifg: [
//     { url: 'http://localhost:3001/home' },
//     { url: 'http://localhost:9001/api/home/wonderfulplace' },
//     { url: 'http://localhost:9001/api/home/goodprice' },
//     { url: 'http://localhost:3001/home' },
//     { url: 'http://localhost:9001/ai/home/goodprice' }
//   ]
// })

// testXCrawl.fetchPolling({ m: 3 }, () => {
// testXCrawl
//   .fetchHTML('https://www.bilibili.com/guochuang/', (res) => {
//     console.log('fetchHTML Callback: ', res.statusCode)
//   })
//   .then((res) => {
//     const { jsdom } = res.data

//     const imgSrc: string[] = []
//     const recomEls = jsdom.window.document.querySelectorAll('.chief-recom-item')
//     recomEls.forEach((item) => imgSrc.push(item.querySelector('img')!.src))

//     const requestConifg = imgSrc.map((src) => ({ url: `https:${src}` }))
//     requestConifg.pop()

//     testXCrawl
//       .fetchFile(
//         {
//           requestConifg,
//           fileConfig: { storeDir: path.resolve(__dirname, './upload') }
//         },
//         (res) => {
//           console.log(res.id, res.statusCode, res.data.fileName)
//         }
//       )
//       .then((res) => console.log(res))
//   })
// })
