# Create AI application

## Ollama

create a new ** application instance ** with createCrawlOllama():

```js
import { createCrawlOllama } from 'x-crawl'

const crawlOllamaApp = createCrawlOllama({
  model: "Your model ",
  clientOptions: { ... }
})
```

## Openai

You need to use the OpenAI API Key.

Create a new **application instance** via [createCrawlOpenAI()](/api/create-crawl-openai#createxcrawlopenai):

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})
```

**Get API Key**

- **[OpenAI official API Key](https://platform.openai.com/api-keys)**
- **[Free API Key](https://github.com/chatanywhere/GPT_API_free)**
