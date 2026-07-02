<template>
  <div class="flex flex-col items-center justify-center h-full px-4 sm:px-6 py-8 sm:py-12">
    <!-- Avatar Grande del Dios -->
    <div
      class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-6 rounded-full overflow-hidden shadow-lg ring-4 ring-yellow/20"
    >
      <img
        v-if="assistant?.avatar"
        :src="assistant.avatar"
        :alt="assistant.name"
        class="w-full h-full object-contain"
      />
      <div v-else class="w-full h-full bg-yellow/20 flex items-center justify-center">
        <svg class="w-16 h-16 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
    </div>

    <!-- Mensaje de Bienvenida -->
    <h1 class="text-xl sm:text-2xl md:text-h2 text-center mb-3">
      {{
        assistant?.name
          ? t('chat.interface.welcome_greeting', { name: assistant.name })
          : t('chat.interface.welcome_greeting_default')
      }}
    </h1>

    <p class="text-lg text-text-secondary text-center max-w-md mb-8">
      {{ assistant?.description || t('chat.assistant.default_description') }}
    </p>

    <!-- Input Centrado Grande -->
    <div class="w-full max-w-2xl mb-8">
      <ChatInput
        ref="chatInputRef"
        :placeholder="placeholder || t('chat.interface.ask_anything_placeholder')"
        :show-toolbar="showToolbar"
        @send="handleSendMessage"
      />
    </div>

    <!-- Sugerencias en Grid -->
    <div v-if="displaySuggestions.length > 0" class="w-full max-w-2xl">
      <p class="text-sm font-medium text-text-secondary mb-3 px-1">
        {{ t('chat.interface.suggested_questions_label') }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="(suggestion, index) in displaySuggestions"
          :key="index"
          class="px-4 py-3 bg-lilac/20 border border-lilac rounded-xl hover:bg-lilac/30 hover:shadow-sm transition-all text-sm text-left text-text-primary"
          @click="handleSuggestionClick(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChatInput from '~/components/organisms/ChatInput.vue'

const { t, tm, rt } = useI18n()

interface Assistant {
  id: string
  name: string
  description?: string
  avatar?: string
}

const props = withDefaults(
  defineProps<{
    assistant?: Assistant
    suggestions?: string[]
    placeholder?: string
    showToolbar?: boolean
  }>(),
  {
    placeholder: undefined,
    showToolbar: false,
    suggestions: undefined,
  }
)

const emit = defineEmits<{
  sendMessage: [message: string]
}>()

// Resolve suggestions: use prop if provided, otherwise use i18n defaults
const displaySuggestions = computed(() => {
  return (
    props.suggestions || (tm('chat.interface.default_suggestions') as any[]).map(msg => rt(msg))
  )
})

const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null)

// Methods
const handleSendMessage = (message: string) => {
  emit('sendMessage', message)
}

const handleSuggestionClick = (suggestion: string) => {
  emit('sendMessage', suggestion)
}

// Auto-focus input on mount
onMounted(() => {
  chatInputRef.value?.focus()
})
</script>
