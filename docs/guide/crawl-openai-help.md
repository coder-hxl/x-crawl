# Intelligent reply to crawler questions

Can provide you with intelligent answers and suggestions. Whether it is about crawling strategies, anti-crawling techniques or data processing, you can ask AI questions, and AI will provide you with professional answers and suggestions based on its powerful learning and reasoning capabilities to help you complete your tasks better. Reptile task.

Use the [help()](/api/help#help) method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

xCrawlOpenAIApp.help('What is x-crawl').then((res) => {
  console.log(res)
  /*
    res:
    x-crawl is a flexible Node.js AI-assisted web crawling library. It offers powerful AI-assisted features that make web crawling more efficient, intelligent, and convenient. You can find more information and the source code on x-crawl's GitHub page: https://github.com/coder-hxl/x-crawl.
   */
})

xCrawlOpenAIApp
  .help('Three major things to note about crawlers')
  .then((res) => {
    console.log(res)
    /*
      res:
      There are several important aspects to consider when working with crawlers:

      1. **Robots.txt:** It's important to respect the rules set in a website's robots.txt file. This file specifies which parts of a website can be crawled by search engines and other bots. Not following these rules can lead to your crawler being blocked or even legal issues.

      2. **Crawl Delay:** It's a good practice to implement a crawl delay between your requests to a website. This helps to reduce the load on the server and also shows respect for the server resources.

      3. **User-Agent:** Always set a descriptive User-Agent header for your crawler. This helps websites identify your crawler and allows them to contact you if there are any issues. Using a generic or misleading User-Agent can also lead to your crawler being blocked.

      By keeping these points in mind, you can ensure that your crawler operates efficiently and ethically.
   */
  })
```
