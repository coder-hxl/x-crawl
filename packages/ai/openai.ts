import OpenAI, { ClientOptions } from 'openai'
import ora from 'ora'

import {
  PARSE_ELEMENTS_CONTEXT,
  GET_ELEMENT_SELECTORS_CONTEXT,
  HELP_CONTEXT
} from './context'
import { isObject, logStart, logSuccess } from '../shared'

type OpenAIChatModel = string

export interface CreateCrawlOpenAIConfig {
  defaultModel?: {
    chatModel: (string & {}) | OpenAIChatModel
  }
  clientOptions?: ClientOptions
}

export interface CrawlOpenAICommonAPIOtherOption {
  model?: (string & {}) | OpenAIChatModel
}

export interface CrawlOpenAIRunChatOption {
  model: (string & {}) | OpenAIChatModel | undefined
  context: string
  HTMLContent: string
  userContent: string
  responseFormatType: 'text' | 'json_object'
}

export interface CrawlOpenAIParseElementsContentOptions {
  message: string
}

export interface CrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}

export interface CrawlOpenAIGetElementSelectorsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}

export interface CrawlOpenAIParseElementsResult<
  T extends Record<string, string>
> {
  elements: T[]
  type: 'single' | 'multiple' | 'none'
}

export interface CrawlOpenAIApp {
  parseElements<T extends Record<string, string>>(
    HTML: string,
    content: string | CrawlOpenAIParseElementsContentOptions,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<CrawlOpenAIParseElementsResult<T>>

  getElementSelectors(
    HTML: string,
    content: string | CrawlOpenAIGetElementSelectorsContentOptions,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<CrawlOpenAIGetElementSelectorsResult>

  help(
    content: string,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<string>

  custom(): OpenAI
}

export function createCrawlOpenAI(
  config: CreateCrawlOpenAIConfig = {}
): CrawlOpenAIApp {
  const { defaultModel, clientOptions } = config

  const openai = new OpenAI(clientOptions)
  const chatDefaultModel: (string & {}) | OpenAIChatModel =
    defaultModel?.chatModel ?? 'gpt-3.5-turbo'

  async function runChat<T>(option: CrawlOpenAIRunChatOption): Promise<T> {
    const {
      model = chatDefaultModel,
      context,
      HTMLContent,
      userContent,
      responseFormatType
    } = option

    const spinner = ora(
      logStart(`AI is answering your question, please wait a moment`)
    ).start()
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: context },
        { role: 'user', name: 'html', content: HTMLContent },
        { role: 'user', name: 'my', content: userContent }
      ],
      response_format: { type: responseFormatType },
      temperature: 0.1
    })
    spinner.succeed(logSuccess(`AI has completed your question`))

    const content = completion.choices[0].message.content
    const result =
      responseFormatType === 'json_object' ? JSON.parse(content!) : content

    return result
  }

  const app: CrawlOpenAIApp = {
    async parseElements<T extends Record<string, string>>(
      HTML: string,
      content: string | CrawlOpenAIParseElementsContentOptions,
      option: CrawlOpenAICommonAPIOtherOption = {}
    ): Promise<CrawlOpenAIParseElementsResult<T>> {
      const { model } = option

      let coderContent: string = ''
      if (isObject(content)) {
        coderContent = JSON.stringify(content)
      } else {
        const obj: CrawlOpenAIParseElementsContentOptions = {
          message: content
        }
        coderContent = JSON.stringify(obj)
      }

      const result = await runChat<CrawlOpenAIParseElementsResult<T>>({
        model,
        context: PARSE_ELEMENTS_CONTEXT,
        HTMLContent: HTML,
        userContent: coderContent,
        responseFormatType: 'json_object'
      })

      return result
    },

    async getElementSelectors(
      HTML: string,
      content: string | CrawlOpenAIGetElementSelectorsContentOptions,
      option: CrawlOpenAICommonAPIOtherOption = {}
    ): Promise<CrawlOpenAIGetElementSelectorsResult> {
      const { model } = option

      let coderContent: string = ''
      if (isObject(content)) {
        coderContent = JSON.stringify(content)
      } else {
        const obj: CrawlOpenAIGetElementSelectorsContentOptions = {
          message: content,
          pathMode: 'default'
        }
        coderContent = JSON.stringify(obj)
      }

      const result = await runChat<CrawlOpenAIGetElementSelectorsResult>({
        model,
        context: GET_ELEMENT_SELECTORS_CONTEXT,
        HTMLContent: HTML,
        userContent: coderContent,
        responseFormatType: 'json_object'
      })

      return result
    },

    async help(
      content: string,
      option: CrawlOpenAICommonAPIOtherOption = {}
    ): Promise<string> {
      const { model } = option

      const result = await runChat<string>({
        model,
        context: HELP_CONTEXT,
        HTMLContent: '',
        userContent: content,
        responseFormatType: 'text'
      })

      return result
    },

    custom() {
      return openai
    }
  }

  return app
}
