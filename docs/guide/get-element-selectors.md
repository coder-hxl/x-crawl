# Intelligent generation of element selectors

It can help us quickly locate specific elements on the page. Just enter the HTML code into AI and tell AI which elements you want to get selectors for, and AI will automatically generate appropriate selectors for you based on the page structure, greatly simplifying the tedious process of determining selectors.

## Ollama

Use the getElementSelectors() method of the AI application instance.

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
  .getElementSelectors(HTMLContent, `all Women's wear`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        selectors: '.scroll-list:nth-child(2) .list-item:nth-child(3)',
        type: 'multiple'
      }
    */
  })
```

## Openai

Use the [getElementSelectors()](/api/get-element-selectors#getelementselectors) method of the AI application instance.

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
  .getElementSelectors(HTMLContent, `all Women's wear`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        selectors: '.scroll-list:nth-child(2) .list-item:nth-child(3)',
        type: 'multiple'
      }
    */
  })
```

---

You can also pass the entire HTML to AI to help us operate, but it will consume more Tokens. OpenAI charges based on Tokens.
