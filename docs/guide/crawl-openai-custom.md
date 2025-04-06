# User defined AI functions

In order to meet the personalized needs of different users, x-crawl also provides user-customized AI functions. Providing ai instances means you can tailor and optimize the AI to your needs to better suit your crawling efforts.

## Ollama

Use the custom() method for the AI application instance.

Example:

```js{8}
import { createCrawlOllama } from 'x-crawl'

const crawlOllamaApp = createCrawlOllama({
  model: "Your model ",
  clientOptions: { ... }
})

const Ollama = crawlOllamaApp.custom()
```

You can refer to Ollama obtained by calling custom: https://github.com/ollama/ollama-js?tab=readme-ov-file#custom-client, call the custom get Ollama and site sample new Ollama () to get the instance of about the same, The difference is that x-crawl will pass the clientOptions that were passed in when the AI application instance was created to new Ollama. It will get the intact Ollama instance, and x-crawl will not rewrite it.

## Openai

Use the [custom()](/api/custom#custom) method of the AI application instance.

Example:

```js{7}
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const openai = xCrawlOpenAIApp.custom()
```

For the openai obtained by calling custom, please refer to: https://platform.openai.com/docs/api-reference/chat/create?lang=node.js. The openai obtained by calling custom and the website example new OpenAI() can be obtained. The instance is similar. The difference is that x-crawl will pass the clientOptions passed in when creating the AI application instance to new OpenAI. What you get is an intact OpenAI instance, and x-crawl will not rewrite it.
