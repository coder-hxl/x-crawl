# Priority queue

The priority queue allows a certain crawling target to be sent first.

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

The larger the value of the priority attribute, the higher the priority in the current crawling queue.
