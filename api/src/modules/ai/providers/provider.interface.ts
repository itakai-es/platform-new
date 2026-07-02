export interface GenerateTextOptions {
  systemPrompt?: string
  locale?: string
  temperature?: number
  /** Tool declarations for function calling. Provider-agnostic: each provider maps to its SDK format. */
  tools?: unknown[]
  /** Tool executor — called by the provider when the model requests a function call. */
  executeToolCall?: (name: string, args: Record<string, unknown>) => Promise<string>
  /** Conversation history for multi-turn function calling */
  history?: Array<{ role: string; parts: unknown[] }>
}

export interface GenerateImageOptions {
  locale?: string
  type?: 'narratives' | 'badges' | 'avatars' | 'covers'
}

export interface GeneratedImageResult {
  mimeType: string
  buffer: Buffer
  extension: string
}

export interface AIProvider {
  generateText(prompt: string, options?: GenerateTextOptions): Promise<string>
  generateTextStream(prompt: string, options?: GenerateTextOptions): AsyncIterable<string>
  generateImage(prompt: string, options?: GenerateImageOptions): Promise<GeneratedImageResult>
}
