# Crawling interface

Crawl interface data through [crawlData()](#crawlData).

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
  // deal with
})
```

## life cycle

Lifecycle functions owned by crawlData API:

- onCrawlItemComplete: will be called back when each crawling target is completed

### onCrawlItemComplete

In the onCrawlItemComplete function you can get the results of each crawled target in advance.
