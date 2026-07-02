import { GoogleAdkProvider } from './google-adk.js'
import { SparkRouterProvider } from './spark-router.js'
import type { AIProvider } from './provider.interface.js'

let providerInstance: SparkRouterProvider | null = null

export function getAIProvider(): AIProvider {
  if (!providerInstance) {
    providerInstance = new SparkRouterProvider(new GoogleAdkProvider())
  }

  return providerInstance
}

export function getLastUsedProvider(): 'spark' | 'gemini' | 'flux' {
  return providerInstance?.lastUsedProvider ?? 'gemini'
}
