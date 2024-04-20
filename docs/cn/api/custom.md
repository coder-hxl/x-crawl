# custom

custom 是 AI 应用实例的方法，通常用于用户自定义AI功能。

## 类型 {#type}

customAPI 是一个函数。

```ts
function custom(): OpenAI
```

**返回值类型：**

可参考：https://platform.openai.com/docs/api-reference/chat/create?lang=node.js ，调用 custom 拿到的 openai 与网站示例 new OpenAI() 拿到的实例差不多，不同的是 x-crawl 会将创建 AI 应用实例时传入的 clientOptions 传给 new OpenAI ，拿到的是完好无损 OpenAI 实例，x-crawl 并不会对其重写。

## 示例 {#example}

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

const openai = crawlOpenAIApp.custom()
```
