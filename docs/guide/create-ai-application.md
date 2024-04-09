# Create AI application

Currently, x-crawl’s AI auxiliary function relies on OpenAI and requires the use of OpenAI’s API Key. Other AI may be added in the future.

Create a new **application instance** via [createCrawlOpenAI()](#createCrawlOpenAI):

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})
```

**Get API Key**

- **[OpenAI official API Key](https://platform.openai.com/api-keys)**
- **[Free API Key](https://github.com/chatanywhere/GPT_API_free)**
