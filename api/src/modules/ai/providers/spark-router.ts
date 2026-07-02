import type {
  AIProvider,
  GeneratedImageResult,
  GenerateImageOptions,
  GenerateTextOptions,
} from './provider.interface.js'

const DEFAULT_SPARK_ROUTER_BASE_URL = 'http://192.168.14.2:8000'
const DEFAULT_SPARK_ROUTER_API_KEY = 'local-testing-key'
const DEFAULT_SPARK_ROUTER_MODEL = 'google/gemma-4-26b-a4b-it'
const DEFAULT_SPARK_ROUTER_IMAGE_MODEL = 'black-forest-labs/flux.2-klein-4b'
const DEFAULT_TEXT_TIMEOUT_MS = 60_000
const DEFAULT_IMAGE_TIMEOUT_MS = 90_000

type SparkMessageRole = 'system' | 'user' | 'assistant'

interface SparkChatMessage {
  role: SparkMessageRole
  content: string
}

interface SparkChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

interface SparkImageGenerationResponse {
  data?: Array<{
    url?: string
  }>
}

function normalizeBaseUrl(baseUrl?: string) {
  return (baseUrl || DEFAULT_SPARK_ROUTER_BASE_URL).replace(/\/+$/, '')
}

function getSparkConfig() {
  return {
    baseUrl: normalizeBaseUrl(process.env.SPARK_ROUTER_BASE_URL),
    apiKey: process.env.SPARK_ROUTER_API_KEY || DEFAULT_SPARK_ROUTER_API_KEY,
    model: process.env.SPARK_ROUTER_MODEL || DEFAULT_SPARK_ROUTER_MODEL,
    imageModel: process.env.SPARK_ROUTER_IMAGE_MODEL || DEFAULT_SPARK_ROUTER_IMAGE_MODEL,
  }
}

function historyPartToText(part: unknown) {
  if (typeof part === 'string') {
    return part
  }

  if (part && typeof part === 'object' && 'text' in part) {
    const text = (part as { text?: unknown }).text
    return typeof text === 'string' ? text : ''
  }

  return ''
}

function buildMessages(prompt: string, options?: GenerateTextOptions): SparkChatMessage[] {
  const messages: SparkChatMessage[] = []

  if (options?.systemPrompt) {
    messages.push({
      role: 'system',
      content: options.systemPrompt,
    })
  }

  if (options?.history?.length) {
    for (const item of options.history) {
      const content = item.parts.map(historyPartToText).filter(Boolean).join('\n').trim()
      if (!content) {
        continue
      }

      const role: SparkMessageRole =
        item.role === 'assistant' || item.role === 'model' ? 'assistant' : 'user'

      messages.push({ role, content })
    }
  }

  messages.push({
    role: 'user',
    content: prompt,
  })

  return messages
}

function splitTextIntoChunks(text: string) {
  const normalized = text.replace(/\r\n/g, '\n')
  const chunks = normalized.match(/.{1,80}(\s|$)/g)
  return chunks && chunks.length > 0 ? chunks : [normalized]
}

function inferExtension(contentType: string | null, url: string) {
  if (contentType?.includes('jpeg') || contentType?.includes('jpg') || /\.jpe?g(?:$|\?)/i.test(url)) {
    return 'jpg'
  }

  if (contentType?.includes('webp') || /\.webp(?:$|\?)/i.test(url)) {
    return 'webp'
  }

  return 'png'
}

async function fetchJson<T>(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Spark Router ${response.status}: ${detail || response.statusText}`)
  }

  return response.json() as Promise<T>
}

export class SparkRouterProvider implements AIProvider {
  lastUsedProvider: 'spark' | 'gemini' | 'flux' = 'spark'

  constructor(private readonly fallbackProvider?: AIProvider) {}

  async generateText(prompt: string, options?: GenerateTextOptions): Promise<string> {
    const { baseUrl, apiKey, model } = getSparkConfig()

    try {
      const payload = await fetchJson<SparkChatCompletionResponse>(
        `${baseUrl}/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: buildMessages(prompt, options),
            temperature: options?.temperature ?? 0.7,
          }),
        },
        DEFAULT_TEXT_TIMEOUT_MS
      )

      const content = payload.choices?.[0]?.message?.content?.trim()
      if (!content) {
        throw new Error('Spark Router returned an empty text response')
      }

      this.lastUsedProvider = 'spark'
      console.log(`[AI] ✅ Text generated via SparkRouter (model: ${model})`)
      return content
    } catch (error) {
      if (this.fallbackProvider) {
        this.lastUsedProvider = 'gemini'
        console.warn(`[AI] ⚠️ SparkRouter text failed → falling back to Google:`, (error as Error).message)
        return this.fallbackProvider.generateText(prompt, options)
      }

      throw error
    }
  }

  async *generateTextStream(prompt: string, options?: GenerateTextOptions): AsyncIterable<string> {
    const { baseUrl, apiKey, model } = getSparkConfig()

    try {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: buildMessages(prompt, options),
          temperature: options?.temperature ?? 0.7,
          stream: true,
        }),
        signal: AbortSignal.timeout(DEFAULT_TEXT_TIMEOUT_MS),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Spark Router ${response.status}: ${detail || response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Spark Router returned no stream body')

      const decoder = new TextDecoder()
      let buffer = ''
      let hasContent = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              hasContent = true
              yield content
            }
          } catch { /* skip malformed SSE */ }
        }
      }

      if (!hasContent) throw new Error('Spark Router stream returned no content')

      this.lastUsedProvider = 'spark'
      console.log(`[AI] ✅ Text streamed via SparkRouter (model: ${model})`)
    } catch (error) {
      if (this.fallbackProvider) {
        this.lastUsedProvider = 'gemini'
        console.warn(`[AI] ⚠️ SparkRouter stream failed → falling back to Google:`, (error as Error).message)
        yield* this.fallbackProvider.generateTextStream(prompt, options)
        return
      }

      throw error
    }
  }

  async generateImage(prompt: string, options?: GenerateImageOptions): Promise<GeneratedImageResult> {
    const { baseUrl, apiKey, imageModel } = getSparkConfig()

    try {
      console.log(`[AI] 🎨 Image request → SparkRouter (${options?.type || 'image'}, model: ${imageModel})`)
      console.log(`[AI] 🎨 Image prompt → SparkRouter:\n${prompt}`)

      const payload = await fetchJson<SparkImageGenerationResponse>(
        `${baseUrl}/v1/images/generations`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: imageModel,
            prompt,
            size: '1024x1024',
          }),
        },
        DEFAULT_IMAGE_TIMEOUT_MS
      )

      const rawImageUrl = payload.data?.[0]?.url
      if (!rawImageUrl) {
        throw new Error('Spark Router did not return an image URL')
      }

      const imageUrl = rawImageUrl.startsWith('http')
        ? rawImageUrl
        : new URL(rawImageUrl, `${baseUrl}/`).toString()

      const imageResponse = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(DEFAULT_IMAGE_TIMEOUT_MS),
      })

      if (!imageResponse.ok) {
        const detail = await imageResponse.text().catch(() => '')
        throw new Error(`Spark image download ${imageResponse.status}: ${detail || imageResponse.statusText}`)
      }

      const arrayBuffer = await imageResponse.arrayBuffer()
      const mimeType = imageResponse.headers.get('content-type') || 'image/png'

      this.lastUsedProvider = 'spark'
      console.log(`[AI] ✅ Image generated via SparkRouter (model: ${imageModel}, ${(arrayBuffer.byteLength / 1024).toFixed(0)}KB)`)
      return {
        mimeType,
        buffer: Buffer.from(arrayBuffer),
        extension: inferExtension(mimeType, imageUrl),
      }
    } catch (error) {
      if (this.fallbackProvider) {
        this.lastUsedProvider = 'flux'
        console.warn(`[AI] ⚠️ SparkRouter image failed → falling back to Flux/OpenRouter:`, (error as Error).message)
        return this.fallbackProvider.generateImage(prompt, options)
      }

      throw error
    }
  }
}
