# 爬取接口 {#crawling-interface}

通过 [crawlData()](/cn/api/crawl-data#crawldata) 爬取接口数据。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

const targets = [
  'https://www.example.com/api-1',
  'https://www.example.com/api-2',
  {
    url: 'https://www.example.com/api-3',
    method: 'POST',
    data: { name: 'coderhxl' }
  }
]

crawlApp.crawlData({ targets }).then((res) => {
  // 处理
})
```

## 生命周期 {#life-cycle}

crawlData API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。
