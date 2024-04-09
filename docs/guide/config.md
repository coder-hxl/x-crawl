# Configuration

Some common configurations can be set in these three places:

- Application instance configuration (global)
- Advanced configuration (partial)
- Detailed target configuration (separate)

## priority

The priority is: Detailed target configuration > Advanced configuration > Application instance configuration

Take maxRetry retry times as an example:

```js{4,13,16}
import { createCrawl } from 'x-crawl'

//Application instance configuration
const crawlApp = createCrawl({ maxRetry: 3 })

//Advanced configuration
crawlApp
   .crawlPage({
     targets: [
       'https://www.example.com/page-1',
       'https://www.example.com/page-2',
       // Detailed target configuration
       { url: 'https://www.example.com/page-3', maxRetry: 8 },
       'https://www.example.com/page-4'
     ],
     maxRetry: 6
   })
   .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-5').then((res) => {})
```

In the above example, **Number of retries** are set in **Application Instance Configuration**, **Advanced Configuration** and **Detailed Target Configuration**, and page3 will use its own number of retries. (8 times), page1, page2 and page4 will use the number of retries configured in the advanced configuration (6 times), and page5 will use the number of retries configured by the application instance (3 times).

## Cancel reuse configuration options

You can use null to cancel the upper-level configuration.

Take maxRetry retry times as an example:

```js{8,20}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ maxRetry: 3 })

crawlApp
   .crawlPage({
     url: 'https://www.example.com/page-1',
     maxRetry: null
   })
   .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-2').then((res) => {})

crawlApp
   .crawlPage({
     targets: [
       'https://www.example.com/page-3',
       'https://www.example.com/page-4'
     ],
     maxRetry: null
   })
   .then((res) => {})
```

In the above example, page-1, page3, and page4 have all canceled retries, and page2 has 3 retries.
