import XCrawl from '../../src'

const githubDocsXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: {
    max: 3000,
    min: 1000
  }
})

githubDocsXCrawl.fetchHTML('https://docs.github.com/zh').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
