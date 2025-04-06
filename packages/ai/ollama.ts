import { Config, Ollama } from 'ollama'
import ora from 'ora'

import { isObject, logStart, logSuccess } from '../shared'
import {
  GET_ELEMENT_SELECTORS_CONTEXT,
  HELP_CONTEXT,
  PARSE_ELEMENTS_CONTEXT
} from './context'

export interface CreateCrawlOllamaConfig {
  model: string
  clientOptions?: Partial<Config>
}

export interface CrawlOllamaRunChatOption {
  context: string
  HTMLContent: string
  userContent: string
  responseFormatType: 'text' | 'json_object'
}

export interface CrawlOllamaParseElementsContentOptions {
  message: string
}

export interface CrawlOllamaGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}

export interface CrawlOllamaParseElementsResult<
  T extends Record<string, string>
> {
  elements: T[]
  type: 'single' | 'multiple' | 'none'
}

export interface CrawlOllamaGetElementSelectorsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}

export interface CrawlOllamaApp {
  parseElements<T extends Record<string, string>>(
    HTML: string,
    content: string | CrawlOllamaParseElementsContentOptions
  ): Promise<CrawlOllamaParseElementsResult<T>>

  getElementSelectors(
    HTML: string,
    content: string | CrawlOllamaGetElementSelectorsContentOptions
  ): Promise<CrawlOllamaGetElementSelectorsResult>

  help(content: string): Promise<string>

  custom(): Ollama
}

export function createCrawlOllama(
  config: CreateCrawlOllamaConfig
): CrawlOllamaApp {
  const { model, clientOptions } = config

  const ollama = new Ollama(clientOptions)

  async function runChat<T>(option: CrawlOllamaRunChatOption): Promise<T> {
    const { context, HTMLContent, userContent, responseFormatType } = option

    const spinner = ora(
      logStart(`AI is answering your question, please wait a moment`)
    ).start()
    const completion = await ollama.chat({
      model,
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: `html: ${HTMLContent}` },
        { role: 'user', content: `my: ${userContent}` }
      ],
      format: { type: responseFormatType }
    })
    spinner.succeed(logSuccess(`AI has completed your question`))

    const content = completion.message.content
    const result =
      responseFormatType === 'json_object' ? JSON.parse(content!) : content

    return result
  }

  const app: CrawlOllamaApp = {
    async parseElements<T extends Record<string, string>>(
      HTML: string,
      content: string | CrawlOllamaParseElementsContentOptions
    ): Promise<CrawlOllamaParseElementsResult<T>> {
      let coderContent: string = ''
      if (isObject(content)) {
        coderContent = JSON.stringify(content)
      } else {
        const obj: CrawlOllamaParseElementsContentOptions = {
          message: content
        }
        coderContent = JSON.stringify(obj)
      }

      const result = await runChat<CrawlOllamaParseElementsResult<T>>({
        context: PARSE_ELEMENTS_CONTEXT,
        HTMLContent: HTML,
        userContent: coderContent,
        responseFormatType: 'json_object'
      })

      return result
    },

    async getElementSelectors(
      HTML: string,
      content: string | CrawlOllamaGetElementSelectorsContentOptions
    ): Promise<CrawlOllamaGetElementSelectorsResult> {
      let coderContent: string = ''
      if (isObject(content)) {
        coderContent = JSON.stringify(content)
      } else {
        const obj: CrawlOllamaGetElementSelectorsContentOptions = {
          message: content,
          pathMode: 'default'
        }
        coderContent = JSON.stringify(obj)
      }

      const result = await runChat<CrawlOllamaGetElementSelectorsResult>({
        context: GET_ELEMENT_SELECTORS_CONTEXT,
        HTMLContent: HTML,
        userContent: coderContent,
        responseFormatType: 'json_object'
      })

      return result
    },

    async help(content: string): Promise<string> {
      const result = await runChat<string>({
        context: HELP_CONTEXT,
        HTMLContent: '',
        userContent: content,
        responseFormatType: 'text'
      })

      return result
    },

    custom() {
      return ollama
    }
  }

  return app
}
