import path from 'node:path'
import XCrawl from '../../src'

const testXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 },
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
//   testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
//     const { jsdom } = res.data

//     const imgSrc: string[] = []
//     const recomEls = jsdom.window.document.querySelectorAll('.chief-recom-item')
//     recomEls.forEach((item) => imgSrc.push(item.querySelector('img')!.src))

//     const requestConifg = imgSrc.map((src) => ({ url: `https:${src}` }))
//     requestConifg.pop()

//     testXCrawl.fetchFile({
//       requestConifg,
//       fileConfig: { storeDir: path.resolve(__dirname, './upload') }
//     })
//   })
// })

// 'http://127.0.0.1:14892'
testXCrawl
  .fetchHTML({
    url: 'https://www.google.com.hk/',
    proxy: 'http://127.0.0.1:14892'
  })
  .then((res) => {
    console.log(res.statusCode)

    const { jsdom } = res.data

    const imgEl =
      jsdom.window.document.querySelector<HTMLImageElement>('.lnXdpd')

    testXCrawl.fetchFile({
      requestConifg: {
        url: 'https://www.google.com.hk/' + imgEl!.src,
        proxy: 'http://127.0.0.1:14892'
      },
      fileConfig: {
        storeDir: path.resolve(__dirname, './upload'),
        extension: 'jpg'
      }
    })
  })
