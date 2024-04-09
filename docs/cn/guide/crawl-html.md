# 爬取 HTML

通过 [crawlHTML()](#crawlData) 爬取静态 HTML。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlHTML([
    'https://www.example.com/html-1',
    'https://www.example.com/html-2'
  ])
  .then((res) => {
    // 处理
  })
```

## 生命周期

crawlHTML API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。
