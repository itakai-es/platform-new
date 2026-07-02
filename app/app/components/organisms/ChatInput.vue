<template>
  <div class="w-full">
    <!-- Input Principal -->
    <div
      class="relative flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm"
    >
      <input
        ref="inputRef"
        v-model="message"
        type="text"
        :placeholder="placeholder || t('chat.interface.input_placeholder')"
        :disabled="disabled"
        class="flex-1 outline-none border-none focus:outline-none focus:ring-0 focus:border-none text-sm sm:text-base text-text-primary placeholder:text-text-muted bg-white disabled:cursor-not-allowed"
        style="box-shadow: none !important"
        @keydown.enter.prevent="handleSend"
      />

      <!-- Botón Enviar -->
      <button
        :disabled="!canSend"
        :class="[
          'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0',
          canSend
            ? 'bg-navy-700 text-white hover:opacity-90'
            : 'bg-bg-secondary text-text-muted cursor-not-allowed',
        ]"
        @click="handleSend"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>

    <!-- Toolbar (Opcional) -->
    <div v-if="showToolbar" class="flex items-center gap-3 mt-2 px-4">
      <button
        class="text-text-muted hover:text-purple transition-colors"
        :title="t('chat.interface.attach_file')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>

      <button
        class="text-text-muted hover:text-purple transition-colors"
        :title="t('chat.interface.attach_image')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <button
        class="text-text-muted hover:text-purple transition-colors"
        :title="t('chat.interface.mention')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    showToolbar?: boolean
  }>(),
  {
    placeholder: undefined,
    disabled: false,
    showToolbar: false,
  }
)

const emit = defineEmits<{
  send: [message: string]
}>()

// State
const message = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

// Computed
const canSend = computed(() => {
  return message.value.trim().length > 0 && !props.disabled
})

// Methods
const handleSend = () => {
  if (!canSend.value) return

  emit('send', message.value.trim())
  message.value = ''

  // Re-focus input
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Public methods (exposed for parent components)
const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})
</script>
