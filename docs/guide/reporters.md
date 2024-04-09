# Terminal information

The crawling information consists of start (displaying the mode and total number), process (displaying the number and how long to wait), and result (displaying success and failure information). There will be something like **1-page-2** in front of each piece of information. The first 1 represents the first crawler instance, the middle page represents the API type, and the following 2 represents the second page of the first crawler instance. Do this The purpose is to better distinguish which API the information comes from.

When you do not want to display the crawled information in the terminal, you can control the display or hiding through the options.

```js{4,7}
import { createCrawl } from 'x-crawl'

// Only hide the process, start and result display
const crawlApp = createCrawl({ log: { process: false } })

//Hide all information
const crawlApp = createCrawl({ log: false })
```

The log option accepts an object or boolean type:

- Boolean
  - true: show all
  - false: hide all
- object
  - start: control the start information
  - process: control of process information
  - result: control of result information
