import path from 'node:path'
import xCrawl, { createXCrawlOpenAI } from 'x-crawl'

import { BASE_URL, API_KEY } from './envConfig'

const pathResolve = (dirPath: string) => path.resolve(__dirname, dirPath)

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { baseURL: BASE_URL, apiKey: API_KEY }
})

const HTMLContent = `
<div class="box">
  <div class="list-item">男装大衣</div>
  <div class="list-item">女装大衣</div>
  <div class="scroll-list">
    <div class="list-item">男装卫衣</div>
    <div class="list-item">女装卫衣</div>
    <div class="list-item">男装带帽卫衣</div>
  </div>
  <div class="scroll-list" id="short">
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装冰丝短袖</div>
    <div class="list-item">男装圆领短袖</div>
  </div>
  <div class="list-item">男装裤子</div>
</div>
`

xCrawlOpenAIApp.parseElements(HTMLContent, `获取男装, 并去重`).then((res) => {
  console.log(res)
})
