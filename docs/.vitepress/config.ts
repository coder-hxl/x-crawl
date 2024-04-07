import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'x-crawl',
  description: '灵活的 Node.js AI 辅助爬虫库',

  cleanUrls: true,

  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/coder-hxl/x-crawl' },
      { icon: 'discord', link: 'https://discord.gg/SF7aaebg4E' }
    ]
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'cn',

      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: '指南', link: '/guide/index' },
          { text: 'API', link: '/api/index' },
          { text: '关于', link: '/about/index' }
        ],

        search: {
          provider: 'local'
        },

        sidebar: {
          '/guide': [
            {
              text: '开始',
              items: [
                { text: '简介', link: '/guide/index' },
                { text: '快速上手', link: '/guide/quick-start' }
              ]
            },
            {
              text: '基础',
              items: [
                { text: '创建应用', link: '/guide/create-crawl-application' },
                { text: '爬取页面', link: '/guide/crawl-page' },
                { text: '爬取 HTML', link: '/guide/crawl-html' },
                { text: '爬取接口', link: '/guide/crawl-data' },
                { text: '爬取文件', link: '/guide/crawl-file' },
                { text: '间隔时间', link: '/guide/interval' },
                { text: '失败重试', link: '/guide/retry' },
                { text: '轮换代理', link: '/guide/proxy' },
                { text: '优先队列', link: '/guide/priority' },
                { text: '终端信息', link: '/guide/reporters' },
                { text: '关于结果', link: '/guide/results' },
                { text: 'TypeScript', link: '/guide/typescript' }
              ]
            },
            {
              text: 'AI 辅助',
              items: [
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' }
              ]
            },
            {
              text: '进阶',
              items: [
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' },
                { text: '创建 AI 应用', link: '/guide/create-ai-application' }
              ]
            }
          ],
          '/api': [{ text: 'api', items: [] }],
          '/about': [{ text: 'about', items: [] }]
        },

        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2024-present CoderHXL'
        }
      }
    },

    en: { label: 'English', lang: 'en', link: '/en' }
  }
})
