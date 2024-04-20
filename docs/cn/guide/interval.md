# 间隔时间 {#intervals}

间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

爬取间隔时间是由爬取 API 内部自己控制的，并非由爬虫实例控制爬取 API 的间隔时间。

```js{8}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({
    targets: ['https://www.example.com/api-1', 'https://www.example.com/api-2'],
    intervalTime: { max: 2000, min: 1000 }
  })
  .then((res) => {})
```

intervalTime 选项默认为 undefined 。若有设置值，则会在爬取目标前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次爬取目标前必须等待的时间
- IntervalTime: 在 max 和 min 中随机取一个值

::: tip
第一次爬取目标是不会触发间隔时间。
:::
