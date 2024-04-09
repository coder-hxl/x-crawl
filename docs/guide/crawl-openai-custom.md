# User-defined AI functions

In order to meet the personalized needs of different users, x-crawl also provides user-customized AI functions. Providing openai instances means you can tailor and optimize the AI to your needs to better suit your crawling efforts.

Use the custom method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const openai = xCrawlOpenAIApp.custom()
```

For the openai obtained by calling custom, please refer to: https://platform.openai.com/docs/api-reference/chat/create?lang=node.js. The openai obtained by calling custom and the website example new OpenAI() can be obtained. The instance is similar. The difference is that x-crawl will pass the clientOptions passed in when creating the AI application instance to new OpenAI. What you get is an intact OpenAI instance, and x-crawl will not rewrite it.
