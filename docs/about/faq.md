# common problem

## The relationship between crawlPage API and puppeteer

The crawlPage API has built-in [puppeteer](https://github.com/puppeteer/puppeteer). You only need to pass in some configuration options to let x-crawl help you simplify the operation and get intact Brower instances and Pages. instance, x-crawl does not override it.

## Using crawlPage API causes the program to crash

If you need to crawl many pages in one crawlPage, it is recommended that after crawling each page, use [onCrawlItemComplete life cycle function] (#onCrawlItemComplete) to process the results of each target and close the page instance. If no shutdown operation is performed, then The program may crash due to too many pages being opened (related to the performance of the device itself).

```js{11,12,13,14,15,16,,17,,18,35,36,37,38,39,40}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// Recommendations with few crawling targets
crawlApp
   .crawlPage([
     'https://www.example.com/page-1',
     'https://www.example.com/page-2'
   ])
   .then((results) => {
     for (const itemResult of results) {
       const { page } = itemResult.data

       //Close if no longer used
       page.close()
     }
   })

// Crawling recommendations with many targets
//onCrawlItemComplete through advanced configuration
crawlApp.crawlPage({
   targets: [
     'https://www.example.com/page-1',
     'https://www.example.com/page-2',
     'https://www.example.com/page-3',
     'https://www.example.com/page-4',
     'https://www.example.com/page-5',
     'https://www.example.com/page-6',
     'https://www.example.com/page-7',
     'https://www.example.com/page-8',
     'https://www.example.com/page-9',
     'https://www.example.com/page-10'
   ],
   onCrawlItemComplete(crawlPageSingleResult) {
     const { page } = crawlPageSingleResult.data

     //Close if no longer used
     page.close()
   }
})
```
