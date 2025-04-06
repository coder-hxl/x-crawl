---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'x-crawl'
  text: '灵活的 Node.js AI 辅助爬虫库'
  tagline: 使爬虫工作变得更加高效、智能和便捷
  image:
    src: '/logo.svg'
    alt: x-crawl
  actions:
    - theme: brand
      text: 开始
      link: /cn/guide/index
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/coder-hxl/x-crawl

features:
  - title: 🤖 AI 辅助
    details: 集成 ollama 和 openai ，强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。
  - title: 🖋️ 写法灵活
    details: 单个爬取 API 都适配多种配置，每种配置方式都各有千秋。
  - title: ⚙️ 功能丰富
    details: 支持爬动态页面、静态页面、接口数据以及文件数据。
  - title: ⚒️ 控制页面
    details: 爬取动态页面支持自动化操作、键盘输入、事件操作等。
  - title: 👀 设备指纹
    details: 零配置或自定义配置，避免指纹识别从不同位置识别并跟踪我们。
  - title: 🔥 异步同步
    details: 无需切换爬取 API 即可进行异步或同步的爬取模式。
  - title: ⏱️ 间隔爬取
    details: 无间隔、固定间隔以及随机间隔，决定是否高并发爬取。
  - title: 🔄 失败重试
    details: 自定义重试次数，避免因短暂的问题而造成爬取失败。
  - title: ➡️ 轮换代理
    details: 搭配失败重试，自定义错误次数以及 HTTP 状态码自动轮换代理。
  - title: 🚀 优先队列
    details: 根据单个爬取目标的优先级可以优先于其他目标提前爬取。
  - title: 🧾 记录爬取
    details: 可控的爬取信息，会在终端输出彩色字符串信息。
  - title: 🦾 TypeScript支持
    details: 拥有类型，通过泛型实现完整的类型。
---
