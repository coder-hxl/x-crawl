# Intervals

The interval can prevent the amount of concurrency from being too large and putting too much pressure on the server.

The crawling interval is controlled internally by the crawling API itself, not by the crawler instance.

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

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before crawling the target, which can prevent the amount of concurrency from being too large and putting too much pressure on the server.

- number: Fixed the time that must be waited before each crawling target
- IntervalTime: randomly pick a value between max and min

::: tip
The first time the target is crawled, the interval will not be triggered.
:::
