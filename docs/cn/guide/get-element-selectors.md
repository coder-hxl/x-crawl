# 智能生成元素选择器

能够帮助我们快速定位到页面中的特定元素。只需将 HTML 代码输入到 AI 中，并告知 AI 您想获取哪些元素的选择器，AI 便会根据页面结构自动为您生成合适的选择器，大大简化了确定选择器的繁琐过程。

使用 AI 应用实例的 getElementSelectors 方法。

示例：

```js{23}
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const HTMLContent = `
  <div class="scroll-list">
    <div class="list-item">女装带帽卫衣</div>
    <div class="list-item">男装卫衣</div>
    <div class="list-item">女装卫衣</div>
    <div class="list-item">男装带帽卫衣</div>
  </div>
  <div class="scroll-list">
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">女装纯棉短袖</div>
    <div class="list-item">男装冰丝短袖</div>
    <div class="list-item">男装圆领短袖</div>
  </div>
`

crawlOpenAIApp.getElementSelectors(HTMLContent, '获取所有女装').then((res) => {
  console.log(res)
  /*
    res:
    {
      selectors: '.scroll-list:nth-child(1) .list-item:nth-of-type(1), .scroll-list:nth-child(1) .list-item:nth-of-type(3), .scroll-list:nth-child(2) .list-item:nth-of-type(3)',
      type: 'single'
    }
  */
})
```

也可以将整个 HTML 传给 AI 帮我们操作，但是会消耗更多 Tokens ，OpenAI 是根据 Tokens 进行收费的。
