import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface ChatConversation {
  id: string
  title: string
  assistantId: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    sources?: Array<{
      title?: string
      url: string
    }>
  }
}

export interface Assistant {
  id: string
  name: string
  description: string
  avatar: string
  color: string
}

// Default assistant (Atenea)
const DEFAULT_ASSISTANT: Assistant = {
  id: 'atenea',
  name: 'Atenea',
  description:
    'Diosa de la sabiduría. Experta en técnicas de estudio, organización y estrategias de aprendizaje.',
  avatar: '/app/avatars/atenea.svg',
  color: '#FFC338',
}

const AVAILABLE_GODS: Assistant[] = [
  DEFAULT_ASSISTANT,
  {
    id: 'odiseo',
    name: 'Odiseo',
    description: 'Guia de estrategia, foco y toma de decisiones.',
    avatar: '/app/avatars/odiseo.svg',
    color: '#6CF3AF',
  },
  {
    id: 'penelope',
    name: 'Penelope',
    description: 'Guia de constancia, organizacion y progreso sostenido.',
    avatar: '/app/avatars/penelope.svg',
    color: '#FF9CA7',
  },
  {
    id: 'polifemo',
    name: 'Polifemo',
    description: 'Guia de retos, esfuerzo y superacion.',
    avatar: '/app/avatars/polifemo.svg',
    color: '#94A3B8',
  },
  {
    id: 'poseidon',
    name: 'Poseidón',
    description: 'Guia de energia, impulso y exploracion.',
    avatar: '/app/avatars/poseidon.svg',
    color: '#60A5FA',
  },
]

const RANDOM_GOD_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds
const ASSISTANT_REVEAL_DELAY_MS = 14
const ASSISTANT_REVEAL_CHUNK_SIZE = 3

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function splitContentForReveal(content: string) {
  const chunks: string[] = []

  for (let index = 0; index < content.length; index += ASSISTANT_REVEAL_CHUNK_SIZE) {
    chunks.push(content.slice(index, index + ASSISTANT_REVEAL_CHUNK_SIZE))
  }

  return chunks
}

export const useAIAssistantStore = defineStore('aiAssistant', () => {
  // State
  const conversations = ref<ChatConversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const assistant = ref<Assistant>(DEFAULT_ASSISTANT)
  const loadingConversations = ref(false)
  const loadingMessages = ref(false)
  const isStreaming = ref(false) // true while SSE chunks are arriving (typing indicator should NOT show)
  const error = ref<string | null>(null)
  const randomGod = ref<Assistant | null>(null) // For sidebar random display
  const preferredAssistantId = ref<string | null>(null) // Set when navigating from a card action
  const pendingMissionId = ref<string | null>(null) // Set when navigating from a mission page
  const pendingClassId = ref<string | null>(null) // Set when navigating from a mission page
  let randomGodInterval: NodeJS.Timeout | null = null

  // Computed
  const currentConversation = computed(() => {
    if (!currentConversationId.value) return null
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  const hasConversations = computed(() => conversations.value.length > 0)

  const currentGod = computed(() => {
    const activeAssistant = currentConversation.value
      ? getAssistantById(currentConversation.value.assistantId)
      : randomGod.value

    if (!activeAssistant) return null

    return {
      id: activeAssistant.id,
      name: activeAssistant.name,
      avatar: activeAssistant.avatar,
      color: activeAssistant.color,
    }
  })

  function getAssistantById(assistantId?: string | null) {
    return AVAILABLE_GODS.find(god => god.id === assistantId) || DEFAULT_ASSISTANT
  }

  function syncAssistantFromConversation(conversation?: ChatConversation | null) {
    assistant.value = getAssistantById(conversation?.assistantId)
  }

  function getCurrentLocale() {
    const localeCookie = useCookie<string | null>('i18n_redirected')
    return localeCookie.value || 'es'
  }

  function updateMessageInConversation(
    conversationId: string,
    messageId: string,
    updater: (message: ChatMessage) => ChatMessage
  ) {
    const conversationIndex = conversations.value.findIndex(
      conversation => conversation.id === conversationId
    )
    if (conversationIndex === -1) return

    const messageIndex =
      conversations.value[conversationIndex]?.messages.findIndex(
        message => message.id === messageId
      ) ?? -1
    if (messageIndex === -1) return

    const currentMessage = conversations.value[conversationIndex]!.messages[messageIndex]!
    conversations.value[conversationIndex]!.messages.splice(
      messageIndex,
      1,
      updater(currentMessage)
    )
  }

  async function revealAssistantMessage(
    conversationId: string,
    messageId: string,
    fullContent: string,
    metadata?: ChatMessage['metadata']
  ) {
    updateMessageInConversation(conversationId, messageId, message => ({
      ...message,
      content: '',
      metadata: undefined,
    }))

    for (const chunk of splitContentForReveal(fullContent)) {
      updateMessageInConversation(conversationId, messageId, message => ({
        ...message,
        content: message.content + chunk,
      }))
      await wait(ASSISTANT_REVEAL_DELAY_MS)
    }

    updateMessageInConversation(conversationId, messageId, message => ({
      ...message,
      metadata,
    }))
  }

  // Actions

  const hasMoreConversations = ref(false)
  const conversationsPageSize = 20
  // Flag explícito de "ya intentamos cargar las conversaciones al menos una vez".
  // No depende de `conversations.length > 0` porque una lista vacía tras un fetch
  // es válida y no debe disparar refetch en cada visita.
  const hasLoadedConversations = ref(false)

  /**
   * Fetch conversations with pagination and caching.
   * Skips fetch if already loaded unless force=true or loadMore=true.
   */
  async function fetchConversations(loadMore = false, force = false) {
    // Skip if already have data and not loading more or forcing
    if (!loadMore && !force && hasLoadedConversations.value) return

    try {
      if (!loadMore) loadingConversations.value = true
      error.value = null

      const config = useRuntimeConfig()
      const offset = loadMore ? conversations.value.length : 0
      const response = await $fetch<{ conversations: ChatConversation[]; hasMore: boolean }>(
        `${config.public.apiBase}/chat/conversations`,
        {
          method: 'GET',
          params: { limit: conversationsPageSize, offset },
        }
      )

      const parsed = response.conversations.map(conv => ({
        ...conv,
        assistantId: conv.assistantId || DEFAULT_ASSISTANT.id,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: (conv.messages || []).map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))

      if (loadMore) {
        // Append without duplicates
        const existingIds = new Set(conversations.value.map(c => c.id))
        conversations.value.push(...parsed.filter(c => !existingIds.has(c.id)))
      } else {
        conversations.value = parsed
      }

      hasMoreConversations.value = response.hasMore ?? false

      if (currentConversationId.value) {
        const selectedConversation =
          conversations.value.find(conv => conv.id === currentConversationId.value) || null
        syncAssistantFromConversation(selectedConversation)
      }
      hasLoadedConversations.value = true
    } catch (err: any) {
      error.value = err.message || 'Error al cargar conversaciones'
      console.error('Error fetching conversations:', err)
    } finally {
      loadingConversations.value = false
    }
  }

  /**
   * Carga las conversaciones si no se han cargado todavía (o si `force=true`).
   * Es idempotente: llamadas repetidas no disparan más de un fetch en vuelo.
   * Sigue el patrón canónico `ensureX` usado en useTeacherClassDetail/useStudentClassDetail.
   */
  async function ensureConversations(force = false) {
    if (hasLoadedConversations.value && !force) return
    if (loadingConversations.value) return
    await fetchConversations(false, force)
  }

  /**
   * Create new conversation with first message.
   * 1. Shows user message immediately (optimistic)
   * 2. Creates conversation on backend (fast — no AI call)
   * 3. Streams AI response via SSE
   */
  async function createConversation(firstMessage: string): Promise<ChatConversation> {
    try {
      loadingMessages.value = true
      error.value = null

      // Use preferred (from card action) > current god > default
      const selectedAssistantId =
        preferredAssistantId.value ||
        currentGod.value?.id ||
        assistant.value.id ||
        DEFAULT_ASSISTANT.id
      preferredAssistantId.value = null // Clear after use

      // Capture mission context before clearing
      const missionId = pendingMissionId.value
      const classId = pendingClassId.value
      pendingMissionId.value = null
      pendingClassId.value = null

      // 1. Optimistic: show user message immediately
      const optimisticId = `temp-conv-${Date.now()}`
      const optimisticConversation: ChatConversation = {
        id: optimisticId,
        assistantId: selectedAssistantId,
        title: '···',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [
          {
            id: `temp-user-${Date.now()}`,
            role: 'user',
            content: firstMessage,
            timestamp: new Date(),
          },
        ],
      }

      conversations.value.unshift(optimisticConversation)
      currentConversationId.value = optimisticId
      syncAssistantFromConversation(optimisticConversation)

      // 2. Create conversation on backend (fast — only saves conv + user message, no AI)
      const config = useRuntimeConfig()
      const response = await $fetch<{ conversation: ChatConversation }>(
        `${config.public.apiBase}/chat/conversations`,
        {
          method: 'POST',
          body: {
            message: firstMessage,
            assistantId: selectedAssistantId,
            locale: getCurrentLocale(),
            ...(missionId ? { missionId } : {}),
            ...(classId ? { classId } : {}),
          },
        }
      )

      const realConversation: ChatConversation = {
        ...response.conversation,
        assistantId: response.conversation.assistantId || selectedAssistantId,
        createdAt: new Date(response.conversation.createdAt),
        updatedAt: new Date(response.conversation.updatedAt),
        messages: response.conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }

      // Replace optimistic with real
      const idx = conversations.value.findIndex(c => c.id === optimisticId)
      if (idx !== -1) {
        conversations.value.splice(idx, 1, realConversation)
      }
      currentConversationId.value = realConversation.id
      syncAssistantFromConversation(realConversation)

      // 3. Stream AI response via SSE (token by token from Gemini)
      const streamUrl = `${config.public.apiBase}/chat/conversations/${realConversation.id}/messages/stream`
      try {
        await sendMessageWithSSE(streamUrl, firstMessage, realConversation, '', true)
      } catch {
        // Fallback to non-streaming
        console.warn('[AI Chat] SSE failed for first message, using fallback')
        await sendMessageFallback(firstMessage, realConversation, '', true)
      }

      return realConversation
    } catch (err: unknown) {
      conversations.value = conversations.value.filter(c => !c.id.startsWith('temp-conv-'))
      currentConversationId.value = null
      error.value = (err as Error).message || 'Error al crear conversación'
      console.error('Error creating conversation:', err)
      throw err
    } finally {
      loadingMessages.value = false
    }
  }

  /**
   * Load a specific conversation
   */
  async function loadConversation(conversationId: string) {
    try {
      loadingMessages.value = true
      error.value = null

      // If already loaded, just switch to it
      const existing = conversations.value.find(c => c.id === conversationId)
      if (existing && existing.messages.length > 0) {
        currentConversationId.value = conversationId
        syncAssistantFromConversation(existing)
        return existing
      }

      // Otherwise fetch from API
      const config = useRuntimeConfig()
      const response = await $fetch<{ conversation: ChatConversation }>(
        `${config.public.apiBase}/chat/conversations/${conversationId}`,
        { method: 'GET' }
      )

      const conversation: ChatConversation = {
        ...response.conversation,
        assistantId: response.conversation.assistantId || DEFAULT_ASSISTANT.id,
        createdAt: new Date(response.conversation.createdAt),
        updatedAt: new Date(response.conversation.updatedAt),
        messages: response.conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }

      // Update in array
      const index = conversations.value.findIndex(c => c.id === conversationId)
      if (index !== -1) {
        conversations.value[index] = conversation
      } else {
        conversations.value.push(conversation)
      }

      currentConversationId.value = conversationId
      syncAssistantFromConversation(conversation)
      return conversation
    } catch (err: any) {
      error.value = err.message || 'Error al cargar conversación'
      console.error('Error loading conversation:', err)
      throw err
    } finally {
      loadingMessages.value = false
    }
  }

  /**
   * Send message in current conversation using SSE streaming with fallback
   */
  async function sendMessage(content: string) {
    if (!currentConversationId.value) {
      await createConversation(content)
      return
    }

    try {
      loadingMessages.value = true
      error.value = null
      const conversation = conversations.value.find(c => c.id === currentConversationId.value)
      const optimisticMessageId = `temp-user-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: optimisticMessageId,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      if (conversation) {
        conversation.messages.push(optimisticMessage)
        conversation.updatedAt = new Date()
      }

      const config = useRuntimeConfig()
      const streamUrl = `${config.public.apiBase}/chat/conversations/${currentConversationId.value}/messages/stream`

      // Try SSE streaming first
      try {
        await sendMessageWithSSE(streamUrl, content, conversation, optimisticMessageId)
      } catch {
        // Fallback to non-streaming endpoint
        console.warn('[AI Chat] SSE failed, falling back to non-streaming endpoint')
        await sendMessageFallback(content, conversation, optimisticMessageId)
      }
    } catch (err: unknown) {
      const conversation = conversations.value.find(c => c.id === currentConversationId.value)
      if (conversation) {
        conversation.messages = conversation.messages.filter(
          message => !message.id.startsWith('temp-')
        )
      }

      error.value = (err as Error).message || 'Error al enviar mensaje'
      console.error('Error sending message:', err)
      throw err
    } finally {
      loadingMessages.value = false
    }
  }

  async function sendMessageWithSSE(
    url: string,
    content: string,
    conversation: ChatConversation | undefined,
    optimisticMessageId: string,
    skipUserMessage = false
  ) {
    // Must use native fetch for streaming (ReadableStream). $fetch doesn't support it.
    // Add Authorization header manually since fetch() doesn't go through Nitro proxy.
    const authStore = useAuthStore()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authStore.tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.tokens.accessToken}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content, locale: getCurrentLocale(), skipUserMessage }),
      credentials: 'include',
    })

    if (!response.ok || !response.body) {
      throw new Error('SSE stream failed')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let assistantPlaceholderId: string | null = null
    let lineBuffer = '' // Buffer for incomplete SSE lines split across TCP chunks

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = lineBuffer + decoder.decode(value, { stream: true })
        const lines = text.split('\n')
        // Last element may be incomplete — keep it in buffer for next iteration
        lineBuffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue

          try {
            const event = JSON.parse(jsonStr)

            if (event.type === 'user_message' && conversation) {
              // Replace optimistic user message with real one
              const idx = conversation.messages.findIndex(m => m.id === optimisticMessageId)
              const realMsg: ChatMessage = {
                ...event.message,
                timestamp: new Date(event.message.timestamp),
              }
              if (idx !== -1) {
                conversation.messages.splice(idx, 1, realMsg)
              }
            } else if (event.type === 'chunk' && conversation) {
              // Append chunk to assistant message
              if (!assistantPlaceholderId) {
                assistantPlaceholderId = `stream-assistant-${Date.now()}`
                conversation.messages.push({
                  id: assistantPlaceholderId,
                  role: 'assistant',
                  content: '',
                  timestamp: new Date(),
                })
                syncAssistantFromConversation(conversation)
              }
              if (!isStreaming.value && event.text) {
                isStreaming.value = true // First real text chunk — hide typing indicator
              }
              updateMessageInConversation(conversation.id, assistantPlaceholderId, msg => ({
                ...msg,
                content: msg.content + event.text,
              }))
            } else if (event.type === 'done' && conversation && assistantPlaceholderId) {
              updateMessageInConversation(conversation.id, assistantPlaceholderId, msg => ({
                ...msg,
                id: event.messageId,
              }))
              // Update conversation title + timestamp — find fresh ref from array for reactivity
              const freshConv = conversations.value.find(c => c.id === conversation.id)
              if (freshConv) {
                if (event.title) freshConv.title = event.title
                freshConv.updatedAt = new Date()
              }
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } finally {
      // Flush remaining lineBuffer (Bug #4: last event may lack trailing \n)
      if (lineBuffer.trim().startsWith('data: ')) {
        try {
          const jsonStr = lineBuffer.trim().slice(6)
          const event = JSON.parse(jsonStr)
          if (event.type === 'done' && conversation && assistantPlaceholderId) {
            updateMessageInConversation(conversation.id, assistantPlaceholderId, msg => ({
              ...msg,
              id: event.messageId,
            }))
            const freshConv = conversations.value.find(c => c.id === conversation.id)
            if (freshConv && event.title) {
              freshConv.title = event.title
            }
          }
        } catch {
          /* ignore malformed final line */
        }
      }
      reader.releaseLock()
      isStreaming.value = false
    }
  }

  async function sendMessageFallback(
    content: string,
    conversation: ChatConversation | undefined,
    optimisticMessageId: string,
    skipUserMessage = false
  ) {
    const config = useRuntimeConfig()
    const response = await $fetch<{ message: ChatMessage | null; assistantMessage: ChatMessage }>(
      `${config.public.apiBase}/chat/conversations/${currentConversationId.value}/messages`,
      {
        method: 'POST',
        body: { content, locale: getCurrentLocale(), skipUserMessage },
      }
    )

    const assistantMessage: ChatMessage = {
      ...response.assistantMessage,
      timestamp: new Date(response.assistantMessage.timestamp),
    }

    if (conversation) {
      // Replace optimistic user message with real one (only if we created a new one)
      if (response.message && optimisticMessageId) {
        const userMessage: ChatMessage = {
          ...response.message,
          timestamp: new Date(response.message.timestamp),
        }
        const optimisticIndex = conversation.messages.findIndex(m => m.id === optimisticMessageId)
        if (optimisticIndex !== -1) {
          conversation.messages.splice(optimisticIndex, 1, userMessage)
        }
      }

      const assistantPlaceholder: ChatMessage = {
        ...assistantMessage,
        content: '',
        metadata: undefined,
      }
      conversation.messages.push(assistantPlaceholder)
      conversation.updatedAt = new Date()
      syncAssistantFromConversation(conversation)
      await revealAssistantMessage(
        conversation.id,
        assistantPlaceholder.id,
        assistantMessage.content,
        assistantMessage.metadata
      )
    }
  }

  /**
   * Delete a conversation
   */
  async function deleteConversation(conversationId: string) {
    try {
      error.value = null

      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBase}/chat/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      // Remove from local state
      conversations.value = conversations.value.filter(c => c.id !== conversationId)

      // If current conversation was deleted, clear it
      if (currentConversationId.value === conversationId) {
        currentConversationId.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar conversación'
      console.error('Error deleting conversation:', err)
      throw err
    }
  }

  /**
   * Clear current conversation (for starting new one)
   */
  function clearCurrentConversation() {
    currentConversationId.value = null
    assistant.value = randomGod.value || DEFAULT_ASSISTANT
  }

  /**
   * Set preferred assistant ID (used when navigating from a card action to ensure consistency)
   */
  function setPreferredAssistantId(id: string) {
    preferredAssistantId.value = id
  }

  /**
   * Set pending mission context (used when navigating from a mission page to inject context)
   */
  function setPendingMissionContext(missionId: string, classId?: string) {
    pendingMissionId.value = missionId
    pendingClassId.value = classId || null
  }

  /**
   * Get a random god from available assistants
   */
  async function getRandomGod(): Promise<Assistant> {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_GODS.length)
    return AVAILABLE_GODS[randomIndex]!
  }

  /**
   * Initialize random god rotation (called on app mount)
   */
  async function initRandomGodRotation() {
    if (import.meta.client) {
      // Set initial random god
      randomGod.value = await getRandomGod()

      // Clear any existing interval
      if (randomGodInterval) {
        clearInterval(randomGodInterval)
      }

      // Set up interval to change god every 5 minutes
      randomGodInterval = setInterval(async () => {
        randomGod.value = await getRandomGod()
      }, RANDOM_GOD_INTERVAL)
    }
  }

  /**
   * Stop random god rotation
   */
  function stopRandomGodRotation() {
    if (randomGodInterval) {
      clearInterval(randomGodInterval)
      randomGodInterval = null
    }
  }

  return {
    // State
    conversations,
    currentConversationId,
    assistant,
    loadingConversations,
    hasMoreConversations,
    hasLoadedConversations,
    loadingMessages,
    isStreaming,
    error,
    randomGod,

    // Getters
    currentConversation,
    hasConversations,
    currentGod,

    // Actions
    fetchConversations,
    ensureConversations,
    createConversation,
    loadConversation,
    sendMessage,
    deleteConversation,
    clearCurrentConversation,
    setPreferredAssistantId,
    setPendingMissionContext,
    initRandomGodRotation,
    stopRandomGodRotation,
  }
})
