import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'x-crawl',
  base: '/x-crawl/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/x-crawl/logo.svg' }]
  ],

  cleanUrls: true,
  lastUpdated: true,

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
      label: 'English',
      lang: 'en',
      description: 'Flexible Node.js AI-assisted crawler library',

      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/index' },
          { text: 'API', link: '/api/index' },
          { text: 'Type', link: '/type/index' },
          {
            text: 'About',
            items: [
              { text: 'FAQ', link: '/about/faq' },
              { text: 'Community', link: '/about/community' },
              { text: 'Releases', link: '/about/releases' },
              { text: 'Old documents', link: '/about/old-docs' },
              { text: 'Issues', link: '/about/issues' },
              { text: 'Announcements', link: '/about/announcements' }
            ]
          }
        ],

        search: {
          provider: 'local'
        },

        sidebar: {
          '/guide': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/guide/index' },
                { text: 'Quick Start', link: '/guide/quick-start' }
              ]
            },
            {
              text: 'Essentials',
              items: [
                {
                  text: 'Create Application',
                  link: '/guide/create-crawl-application'
                },
                { text: 'Crawl Page', link: '/guide/crawl-page' },
                { text: 'Crawl HTML', link: '/guide/crawl-html' },
                { text: 'Crawl Data', link: '/guide/crawl-data' },
                { text: 'Crawl File', link: '/guide/crawl-file' },
                { text: 'Interval Time', link: '/guide/interval' },
                { text: 'Retry', link: '/guide/retry' },
                { text: 'Proxy', link: '/guide/proxy' },
                { text: 'Priority Crawl', link: '/guide/priority' },
                { text: 'Terminal Prompt', link: '/guide/reporters' },
                { text: 'About the Results', link: '/guide/results' },
                { text: 'TypeScript', link: '/guide/typescript' }
              ]
            },
            {
              text: 'AI Assisted',
              items: [
                {
                  text: 'Creating AI applications',
                  link: '/guide/create-ai-application'
                },
                {
                  text: 'Intelligent on-demand analysis elements',
                  link: '/guide/parse-elements'
                },
                {
                  text: 'Smartly generated element selectors',
                  link: '/guide/get-element-selectors'
                },
                {
                  text: 'Intelligent reply to crawler questions',
                  link: '/guide/crawl-openai-help'
                },
                {
                  text: 'User-defined AI functions',
                  link: '/guide/crawl-openai-custom'
                }
              ]
            },
            {
              text: 'Advance',
              items: [
                { text: 'Crawl mode', link: '/guide/crawl-mode' },
                {
                  text: 'device fingerprinting',
                  link: '/guide/fingerprint'
                },
                { text: 'configuration', link: '/guide/config' }
              ]
            }
          ],

          '/api': [
            {
              text: 'crawler',
              items: [
                { text: 'createCrawl', link: '/api/index' },
                { text: 'crawlPage', link: '/api/crawl-page' },
                { text: 'crawlHTML', link: '/api/crawl-html' },
                { text: 'crawlData', link: '/api/crawl-data' },
                { text: 'crawlFile', link: '/api/crawl-file' }
              ]
            },
            {
              text: 'AI',
              items: [
                {
                  text: 'createCrawlOpenAI',
                  link: '/api/create-crawl-openai'
                },
                { text: 'parseElements', link: '/api/parse-elements' },
                {
                  text: 'getElementSelectors',
                  link: '/api/get-element-selectors'
                },
                { text: 'help', link: '/api/help' },
                { text: 'custom', link: '/api/custom' }
              ]
            }
          ],

          '/type': [
            {
              text: 'crawler',
              items: [
                { text: 'createCrawl', link: '/type/index' },
                { text: 'crawlPage', link: '/type/crawl-page' },
                { text: 'crawlHTML', link: '/type/crawl-html' },
                { text: 'crawlData', link: '/type/crawl-data' },
                { text: 'crawlFile', link: '/type/crawl-file' },
                {
                  text: 'CrawlOtherConfig',
                  link: '/type/crawl-other-config'
                }
              ]
            },
            {
              text: 'AI',
              items: [
                {
                  text: 'createCrawlOpenAI',
                  link: '/type/create-crawl-openai'
                },
                { text: 'parseElements', link: '/type/parse-elements' },
                {
                  text: 'getElementSelectors',
                  link: '/type/get-element-selectors'
                },
                {
                  text: 'CrawlOpenaiOtherConfig',
                  link: '/type/crawl-openai-other-config'
                }
              ]
            }
          ]
        },

        footer: {
          message: 'Released under the MIT license',
          copyright: 'Copyright © 2024-present CoderHXL. All rights reserved'
        },

        editLink: {
          pattern: 'https://github.com/coder-hxl/x-crawl/edit/main/docs/:path',
          text: 'Suggest changes to this page'
        }
      }
    },

    cn: {
      label: '简体中文',
      lang: 'cn',
      link: '/cn/',
      description: '灵活的 Node.js AI 辅助爬虫库',

      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: '指南', link: '/cn/guide/index' },
          { text: 'API', link: '/cn/api/index' },
          { text: 'Type', link: '/cn/type/index' },
          {
            text: '关于',
            items: [
              { text: '常见问题', link: '/cn/about/faq' },
              { text: '社区', link: '/cn/about/community' },
              { text: '版本发布', link: '/cn/about/releases' },
              { text: '旧版本文档', link: '/cn/about/old-docs' },
              { text: 'Issues', link: '/cn/about/issues' },
              { text: '注意事项', link: '/cn/about/announcements' }
            ]
          }
        ],

        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        },

        sidebar: {
          '/cn/guide': [
            {
              text: '开始',
              items: [
                { text: '简介', link: '/cn/guide/index' },
                { text: '快速上手', link: '/cn/guide/quick-start' }
              ]
            },
            {
              text: '基础',
              items: [
                {
                  text: '创建应用',
                  link: '/cn/guide/create-crawl-application'
                },
                { text: '爬取页面', link: '/cn/guide/crawl-page' },
                { text: '爬取 HTML', link: '/cn/guide/crawl-html' },
                { text: '爬取接口', link: '/cn/guide/crawl-data' },
                { text: '爬取文件', link: '/cn/guide/crawl-file' },
                { text: '间隔时间', link: '/cn/guide/interval' },
                { text: '失败重试', link: '/cn/guide/retry' },
                { text: '轮换代理', link: '/cn/guide/proxy' },
                { text: '优先队列', link: '/cn/guide/priority' },
                { text: '终端信息', link: '/cn/guide/reporters' },
                { text: '关于结果', link: '/cn/guide/results' },
                { text: 'TypeScript', link: '/cn/guide/typescript' }
              ]
            },
            {
              text: 'AI 辅助',
              items: [
                {
                  text: '创建 AI 应用',
                  link: '/cn/guide/create-ai-application'
                },
                { text: '智能按需分析元素', link: '/cn/guide/parse-elements' },
                {
                  text: '智能生成元素选择器',
                  link: '/cn/guide/get-element-selectors'
                },
                {
                  text: '智能回复爬虫问题',
                  link: '/cn/guide/crawl-openai-help'
                },
                {
                  text: '用户自定义 AI 功能',
                  link: '/cn/guide/crawl-openai-custom'
                }
              ]
            },
            {
              text: '进阶',
              items: [
                { text: '爬取模式', link: '/cn/guide/crawl-mode' },
                { text: '设备指纹', link: '/cn/guide/fingerprint' },
                { text: '配置', link: '/cn/guide/config' }
              ]
            }
          ],

          '/cn/api': [
            {
              text: '爬虫',
              items: [
                { text: 'createCrawl', link: '/cn/api/index' },
                { text: 'crawlPage', link: '/cn/api/crawl-page' },
                { text: 'crawlHTML', link: '/cn/api/crawl-html' },
                { text: 'crawlData', link: '/cn/api/crawl-data' },
                { text: 'crawlFile', link: '/cn/api/crawl-file' }
              ]
            },
            {
              text: 'AI',
              items: [
                {
                  text: 'createCrawlOpenAI',
                  link: '/cn/api/create-crawl-openai'
                },
                { text: 'parseElements', link: '/cn/api/parse-elements' },
                {
                  text: 'getElementSelectors',
                  link: '/cn/api/get-element-selectors'
                },
                { text: 'help', link: '/cn/api/help' },
                { text: 'custom', link: '/cn/api/custom' }
              ]
            }
          ],

          '/cn/type': [
            {
              text: '爬虫',
              items: [
                { text: 'createCrawl', link: '/cn/type/index' },
                { text: 'crawlPage', link: '/cn/type/crawl-page' },
                { text: 'crawlHTML', link: '/cn/type/crawl-html' },
                { text: 'crawlData', link: '/cn/type/crawl-data' },
                { text: 'crawlFile', link: '/cn/type/crawl-file' },
                {
                  text: 'CrawlOtherConfig',
                  link: '/cn/type/crawl-other-config'
                }
              ]
            },
            {
              text: 'AI',
              items: [
                {
                  text: 'createCrawlOpenAI',
                  link: '/cn/type/create-crawl-openai'
                },
                { text: 'parseElements', link: '/cn/type/parse-elements' },
                {
                  text: 'getElementSelectors',
                  link: '/cn/type/get-element-selectors'
                },
                {
                  text: 'CrawlOpenaiOtherConfig',
                  link: '/cn/type/crawl-openai-other-config'
                }
              ]
            }
          ]
        },

        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2024-present CoderHXL'
        },

        editLink: {
          pattern: 'https://github.com/coder-hxl/x-crawl/edit/main/docs/:path',
          text: '为此页提供修改建议'
        }
      }
    }
  }
})
