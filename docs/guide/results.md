# About the results

Each crawl target will generate a details object, which will contain the following properties:

- id: generated according to the order of crawling targets. If there is a priority, it will be generated according to the priority.
- isSuccess: whether the crawling was successful
- maxRetry: The maximum number of retries for this crawling target
- retryCount: the number of times the crawling target has been retried
- proxyDetails: record proxy status
- crawlErrorQueue: Collection of error reports for the crawl target
- data: the crawling data of the crawling target

If it is a specific configuration, it will automatically determine whether the details object is stored in an array according to the configuration method you choose, and return the array, otherwise the details object will be returned. Already typed perfectly in TypeScript.

For details on the relevant configuration methods and results:

- [crawlPage Configuration](/api/crawl-page#Configuration)
- [crawlHTML Configuration](/api/crawl-html#Configuration)
- [crawlData Configuration](/api/crawl-data#Configuration)
- [crawlFile Configuration](/api/crawl-file#Configuration)
