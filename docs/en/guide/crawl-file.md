# Crawl files

Crawl file data via [crawlFile()](#crawlFile).

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDirs: './upload' // Storage folder
  })
  .then((res) => {})
```

## life cycle

The lifecycle functions owned by crawlFile API:

- onCrawlItemComplete: will be called back when each crawling target is completed

- onBeforeSaveItemFile: will be called back before saving the file

### onCrawlItemComplete

In the onCrawlItemComplete function you can get the results of each crawled target in advance.

### onBeforeSaveItemFile

In the onBeforeSaveItemFile function, you can get a Buffer type file, you can process the Buffer, and then return a Buffer or a Promise whose return value is a Buffer. x-crawl will replace the returned Buffer with the obtained Buffer and store it in in the file.

## Example

**Resize image**

Use the sharp library to resize the images that need to be crawled:

```js{12}
import { createCrawl } from 'x-crawl'
import sharp from 'sharp'

const crawlApp = createCrawl()

crawlApp
   .crawlFile({
     targets: [
       'https://www.example.com/file-1.jpg',
       'https://www.example.com/file-2.jpg'
     ],
     onBeforeSaveItemFile: (info) => sharp(info.data).resize(200).toBuffer()
   })
   .then((res) => {
     res.forEach((item) => {
       console.log(item.data?.data.isSuccess)
     })
   })
```
