import { ensureSafeEducationalPrompt } from '../ai-safety.js'
import { applyEducationalRules, type EducationalFilterContext } from './educational-rules.js'

export function filterPrompt(prompt: string, role: string | null) {
  return role === 'student' ? ensureSafeEducationalPrompt(prompt) : prompt.trim()
}

export function filterResponse(content: string, context: EducationalFilterContext) {
  return applyEducationalRules(content, context)
}
