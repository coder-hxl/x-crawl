# Intelligent on-demand analysis elements

No need to manually analyze the HTML page structure to extract the required element attributes or values. Now you just need to input the HTML code into AI and tell AI which elements you want to get information about, and AI will automatically analyze the page structure and extract the corresponding element attributes or values.

## Ollama

Use the parseElements() method of the AI application instance.

Example:

```js{25}
import { createXCrawlOllama } from 'x-crawl'

const xCrawlOllamaApp = createXCrawlOllama({
  model: "Your model ",
  clientOptions: { ... }
})

const HTMLContent = `
   <div class="scroll-list">
     <div class="list-item">Women's hooded sweatshirt</div>
     <div class="list-item">Men's sweatshirts</div>
     <div class="list-item">Women's sweatshirt</div>
     <div class="list-item">Men's hooded sweatshirt</div>
   </div>
   <div class="scroll-list">
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Women's pure cotton short sleeves</div>
     <div class="list-item">Men's ice silk short sleeves</div>
     <div class="list-item">Men's round neck short sleeves</div>
   </div>
`

xCrawlOllamaApp
  .parseElements(HTMLContent, `Take all men's clothing and remove duplicates`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        elements: [
          { content: "Men's hooded sweatshirt" },
          { content: "Men's sweatshirts" },
          { content: "Men's pure cotton short sleeves" },
          { content: "Men's ice silk short sleeves" },
          { content: "Men's round neck short sleeves" }
        ],
        type: 'multiple'
      }
    */
  })
```

## Openai

Use the [parseElements()](/api/parse-elements#parseelements) method of the AI application instance.

Example:

```js{24}
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const HTMLContent = `
   <div class="scroll-list">
     <div class="list-item">Women's hooded sweatshirt</div>
     <div class="list-item">Men's sweatshirts</div>
     <div class="list-item">Women's sweatshirt</div>
     <div class="list-item">Men's hooded sweatshirt</div>
   </div>
   <div class="scroll-list">
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Women's pure cotton short sleeves</div>
     <div class="list-item">Men's ice silk short sleeves</div>
     <div class="list-item">Men's round neck short sleeves</div>
   </div>
`

xCrawlOpenAIApp
  .parseElements(HTMLContent, `Take all men's clothing and remove duplicates`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        elements: [
          { content: "Men's hooded sweatshirt" },
          { content: "Men's sweatshirts" },
          { content: "Men's pure cotton short sleeves" },
          { content: "Men's ice silk short sleeves" },
          { content: "Men's round neck short sleeves" }
        ],
        type: 'multiple'
      }
    */
  })
```

---

You can also pass the entire HTML to AI to help us operate, but it will consume more Tokens. OpenAI charges based on Tokens.
