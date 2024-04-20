# getElementSelectors

getElementSelectors 是 AI 应用实例的方法，通常用于智能生成元素选择器。

## 类型 {#type}

parseElements API 是一个函数。

```ts
function getElementSelectors(
  HTML: string,
  content: string | CrawlOpenAIGetElementSelectorsContentOptions,
  option?: CrawlOpenAICommonAPIOtherOption
): Promise<CrawlOpenAIGetElementSelectorsResult>
```

**参数类型：**

- 查看 [CrawlOpenAIGetElementSelectorsContentOptions](/cn/type/get-element-selectors#crawlopenaigetelementselectorscontentoptions) 类型
- 查看 [CrawlOpenAICommonAPIOtherOption](/cn/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) 类型

**返回值类型：**

- 查看 [CrawlOpenAIGetElementSelectorsResult](/cn/type/get-element-selectors#crawlopenaigetelementselectorsresult) 类型

## 示例 {#example}

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp.getElementSelectors('HTML', '告诉 AI 你想要的').then((res) => {})
```
