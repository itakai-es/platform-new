<script setup lang="ts">
import { useAIAssistantStore } from '~/stores/aiAssistant'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const props = defineProps<{
  suggestions: string[]
  placeholder?: string
}>()

const store = useAIAssistantStore()
const { currentConversation, loadingMessages } = storeToRefs(store)
const route = useRoute()
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  const container = messagesContainer.value
  if (!container) return
  container.scrollTop = container.scrollHeight
}

const handleSendMessage = async (message: string) => {
  await store.sendMessage(message)
}

// Auto-send message from query param (e.g. from AI card actions)
onMounted(async () => {
  const queryMessage = route.query.message as string | undefined
  const queryAssistantId = route.query.assistantId as string | undefined
  const queryMissionId = route.query.missionId as string | undefined
  const queryClassId = route.query.classId as string | undefined
  if (queryMessage) {
    // Clear any open conversation so a new one gets created
    store.clearCurrentConversation()
    // Lock the god to the one from the card that triggered this navigation
    if (queryAssistantId) {
      store.setPreferredAssistantId(queryAssistantId)
    }
    // Store mission context for conversation creation
    if (queryMissionId) {
      store.setPendingMissionContext(queryMissionId, queryClassId)
    }
    await navigateTo({ path: route.path }, { replace: true })
    while (store.loadingConversations) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    await handleSendMessage(queryMessage)
  }
})

watch(
  () => [
    currentConversation.value?.id,
    currentConversation.value?.messages.length,
    currentConversation.value?.messages[
      currentConversation.value?.messages.length ? currentConversation.value.messages.length - 1 : 0
    ]?.content,
    loadingMessages.value,
  ],
  () => {
    void scrollToBottom()
  }
)
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Empty State -->
    <EmptyChat
      v-if="!store.currentConversation"
      :assistant="store.currentGod ?? undefined"
      :suggestions="suggestions"
      @send-message="handleSendMessage"
    />

    <!-- Active Conversation -->
    <div v-else class="flex flex-col h-full">
      <!-- Chat header — shows current god (hidden on mobile, layout has its own) -->
      <div
        class="hidden lg:flex flex-shrink-0 items-center gap-3 px-4 sm:px-6 py-2.5 border-b border-gray-100"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            :src="store.currentGod?.avatar || '/app/avatars/atenea.svg'"
            :alt="store.currentGod?.name || 'Asistente'"
            class="w-full h-full object-contain"
          />
        </div>
        <p class="text-sm font-semibold text-navy-700">
          {{ store.currentGod?.name || 'Asistente IA' }}
        </p>
      </div>

      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 space-y-3 sm:space-y-4 bg-[#FAFAFA]"
      >
        <ChatMessage
          v-for="msg in store.currentConversation.messages"
          :key="msg.id"
          :message="msg"
          :assistant-avatar="store.assistant.avatar"
        />

        <TypingIndicator
          v-if="store.loadingMessages && !store.isStreaming"
          :assistant-avatar="store.assistant.avatar"
        />
      </div>

      <!-- Input -->
      <div class="flex-shrink-0 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white">
        <ChatInput
          :placeholder="placeholder || t('chat.interface.message_input_placeholder')"
          :disabled="store.loadingMessages"
          @send="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>
