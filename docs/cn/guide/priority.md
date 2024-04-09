# 优先队列

优先队列可以让某个爬取目标优先发送。

```js{7,8,9}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData([
    { url: 'https://www.example.com/api-1', priority: 1 },
    { url: 'https://www.example.com/api-2', priority: 10 },
    { url: 'https://www.example.com/api-3', priority: 8 }
  ])
  .then((res) => {})
```

priority 属性的值越大就在当前爬取队列中越优先。
