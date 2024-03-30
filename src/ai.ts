import OpenAI, { ClientOptions } from 'openai'

import {
  PARSE_ELEMENTS_CONTEXT,
  GET_ELEMENT_SELECTORS_CONTEXT
} from './default'

type Model =
  | 'gpt-4-0125-preview'
  | 'gpt-4-turbo-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4-vision-preview'
  | 'gpt-4'
  | 'gpt-4-0314'
  | 'gpt-4-0613'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-4-32k-0613'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-0301'
  | 'gpt-3.5-turbo-0613'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo-16k-0613'

interface AIAssistantOpetion {
  model?: Model
  clientOptions?: ClientOptions
}

interface GetCommonOtherOption {
  model?: Model
}

interface RunOption {
  model: Model | undefined
  context: string
  HTMLContent: string
  userContent: string
}

interface ParseElementsContentOption {
  message: string
}

interface GetElementSelectorsContentOption {
  message: string
  pathMode: 'default' | 'strict'
}

interface ParseElementsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}

interface GetElementSelectorsResult {
  elements: string[]
  type: 'single' | 'multiple' | 'none'
}

class AIAssistant {
  protected openai: OpenAI
  private model: Model

  constructor(AIAssistantOpetion: AIAssistantOpetion = {}) {
    const { model, clientOptions } = AIAssistantOpetion

    this.openai = new OpenAI(clientOptions)
    this.model = model ?? 'gpt-3.5-turbo'
  }

  private async run<T>(option: RunOption): Promise<T> {
    const { model = this.model, context, HTMLContent, userContent } = option

    const completion = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: context },
        { role: 'user', name: 'x-crawl', content: HTMLContent },
        { role: 'user', name: 'coder', content: userContent }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(
      completion.choices[0].message.content ?? '{}'
    ) as any

    console.log(result)

    return result
  }

  async parseElements(
    HTML: string,
    content: string | ParseElementsContentOption,
    option: GetCommonOtherOption = {}
  ): Promise<ParseElementsResult> {
    const { model } = option

    let coderContent: string = ''
    if (typeof content === 'object' && content !== null) {
      coderContent = JSON.stringify(content)
    } else {
      const obj: ParseElementsContentOption = {
        message: content
      }
      coderContent = JSON.stringify(obj)
    }

    const result = await this.run<ParseElementsResult>({
      model,
      context: PARSE_ELEMENTS_CONTEXT,
      HTMLContent: HTML,
      userContent: coderContent
    })

    return result
  }

  async getElementSelectors(
    HTML: string,
    content: string | GetElementSelectorsContentOption,
    option: GetCommonOtherOption = {}
  ): Promise<GetElementSelectorsResult> {
    const { model } = option

    let coderContent: string = ''
    if (typeof content === 'object' && content !== null) {
      coderContent = JSON.stringify(content)
    } else {
      const obj: GetElementSelectorsContentOption = {
        message: content,
        pathMode: 'default'
      }
      coderContent = JSON.stringify(obj)
    }

    const result = await this.run<GetElementSelectorsResult>({
      model,
      context: GET_ELEMENT_SELECTORS_CONTEXT,
      HTMLContent: HTML,
      userContent: coderContent
    })

    return result
  }

  custom() {
    return this.openai
  }
}

export default AIAssistant
