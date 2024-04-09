#custom

custom is a method of AI application instance, usually used for user-defined AI functions.

## type

customAPI is a function.

```ts
function custom(): OpenAI
```

**Return value type:**

You can refer to: https://platform.openai.com/docs/api-reference/chat/create?lang=node.js. The openai obtained by calling custom is similar to the instance obtained by the website example new OpenAI(). The differences are x-crawl will pass the clientOptions passed in when creating the AI application instance to new OpenAI. What you will get is an intact OpenAI instance, and x-crawl will not rewrite it.

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

const openai = xCrawlOpenAIApp.custom()
```
