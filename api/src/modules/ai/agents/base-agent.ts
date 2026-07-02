import type { AIProvider } from '../providers/provider.interface.js'
import { filterPrompt, filterResponse } from '../filters/safety-filter.js'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentRequestContext {
  userId: string
  role: string | null
  assistantId: string
  message: string
  locale: string
  history?: ConversationMessage[]
  /** Optional mission ID for injecting mission context into the prompt */
  missionId?: string
  /** Tool declarations for function calling (teacher only) */
  tools?: unknown[]
  /** Tool executor callback — provider calls this when model requests a function */
  executeToolCall?: (name: string, args: Record<string, unknown>) => Promise<string>
}

export abstract class BaseAgent {
  constructor(
    protected readonly provider: AIProvider,
    protected readonly agentId: 'teacher' | 'student'
  ) {}

  protected abstract buildSystemPrompt(context: AgentRequestContext): Promise<string> | string
  protected abstract buildPrompt(context: AgentRequestContext): Promise<string> | string

  async respond(context: AgentRequestContext) {
    const safePrompt = filterPrompt(context.message, context.role)
    const hydratedContext = { ...context, message: safePrompt }
    const systemPrompt = await this.buildSystemPrompt(hydratedContext)
    const prompt = await this.buildPrompt(hydratedContext)

    const text = await this.provider.generateText(prompt, {
      locale: context.locale,
      systemPrompt,
      temperature: 0.4,
      tools: context.tools,
      executeToolCall: context.executeToolCall,
    })

    return filterResponse(text, {
      role: context.role,
      assistantId: context.assistantId,
      originalPrompt: context.message,
    })
  }

  async *respondStream(context: AgentRequestContext): AsyncIterable<string> {
    const safePrompt = filterPrompt(context.message, context.role)
    const hydratedContext = { ...context, message: safePrompt }
    const systemPrompt = await this.buildSystemPrompt(hydratedContext)
    const prompt = await this.buildPrompt(hydratedContext)

    for await (const chunk of this.provider.generateTextStream(prompt, {
      locale: context.locale,
      systemPrompt,
      temperature: 0.4,
      tools: context.tools,
      executeToolCall: context.executeToolCall,
    })) {
      yield chunk
    }
  }
}
