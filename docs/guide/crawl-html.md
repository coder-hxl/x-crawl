# Crawl HTML

Crawl static HTML via [crawlHTML()](/api/crawl-html#crawlhtml).

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlHTML([
    'https://www.example.com/html-1',
    'https://www.example.com/html-2'
  ])
  .then((res) => {
    // deal with
  })
```

## life cycle

The lifecycle functions owned by crawlHTML API:

- onCrawlItemComplete: will be called back when each crawling target is completed

### onCrawlItemComplete

In the onCrawlItemComplete function you can get the results of each crawled target in advance.
