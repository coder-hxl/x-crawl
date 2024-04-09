# 爬取文件

通过 [crawlFile()](/cn/api/crawl-file#crawlfile) 爬取文件数据。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDirs: './upload' // 存放文件夹
  })
  .then((res) => {})
```

## 生命周期

crawlFile API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

- onBeforeSaveItemFile: 会在保存文件前回调

### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

### onBeforeSaveItemFile

在 onBeforeSaveItemFile 函数中你可以拿到 Buffer 类型的文件，你可以对该 Buffer 进行处理，然后返回一个 Buffer 或者一个返回值是 Buffer 的 Promise ，x-crawl 会将返回的 Buffer 替换掉拿到的 Buffer 存储到文件中。

## 示例

**调整图片大小**

使用 sharp 库对需要爬取的图片进行调整大小操作:

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
