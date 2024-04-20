### 失败重试 {#about-the-result}

可避免因一时问题而造成爬取失败，将会等待这一轮爬取目标结束后重新爬取目标。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

```js{6}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
  .then((res) => {})
```

maxRetry 属性决定要重试几次。
