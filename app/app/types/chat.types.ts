export type AssistantType = 'atenea' | 'odiseo' | 'penelope' | 'polifemo' | 'poseidon'

export interface Assistant {
  id: AssistantType
  name: string
  title: string
  avatar: string
  color: string
  description: string
  specialties: string[]
  available: boolean
  // Campos para guide selector (perfil de estudiante)
  trait?: string
  bgColor?: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  assistantId?: AssistantType
  metadata?: {
    tokens?: number
    sources?: string[]
    suggestions?: string[]
  }
}

export interface Conversation {
  id: string
  assistantId: AssistantType
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  archived: boolean
}

export interface ChatRequest {
  conversationId?: string
  assistantId: AssistantType
  message: string
}

export interface ChatResponse {
  conversationId: string
  message: ChatMessage
  suggestions?: string[]
}
