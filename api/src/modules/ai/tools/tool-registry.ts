import type { FunctionDeclaration } from '@google/generative-ai'

export interface ToolHandler {
  declaration: FunctionDeclaration
  execute: (args: Record<string, unknown>) => Promise<string>
}

const tools = new Map<string, ToolHandler>()

export function registerTool(name: string, handler: ToolHandler) {
  tools.set(name, handler)
}

export function getToolDeclarations(): FunctionDeclaration[] {
  return Array.from(tools.values()).map(t => t.declaration)
}

export function getTool(name: string): ToolHandler | undefined {
  return tools.get(name)
}

export function getAllTools(): Map<string, ToolHandler> {
  return tools
}
