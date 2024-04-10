# createCrawlOpenAI

Create an AI application instance by calling createCrawlOpenAI.

## type

createCrawlOpenAI API is a function.

```ts
function createCrawlOpenAI(config?: createCrawlOpenAIConfig): crawlOpenAIApp
```

**Parameter Type:**

- View the [createCrawlOpenAIConfig](/type/create-crawl-openai#createcrawlopenaiconfig) type

**Return value type:**

- View the [crawlOpenAIApp](/type/create-crawl-openai#crawlopenaiapp) type

## Example

```js
import { createCrawlOpenAI } from 'x-crawl'

// crawlOpenAIApp API
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```
