import type { AIProvider } from '../providers/provider.interface.js'
import { COVER_IMAGE } from '../prompts/index.js'

export async function generateSceneDescription(
  provider: AIProvider,
  narrative: string
): Promise<string> {
  try {
    const text = await provider.generateText(narrative, {
      systemPrompt: COVER_IMAGE.sceneSystem,
      temperature: 0.8,
    })
    return text?.trim() || narrative.slice(0, 200)
  } catch (error) {
    console.error('[cover-prompt] Scene description generation failed:', error)
    return narrative.slice(0, 200)
  }
}

export const buildCinematicCoverPrompt = COVER_IMAGE.buildCinematic
