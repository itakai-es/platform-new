<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Content -->
    <div class="flex-1 onb-result-box overflow-y-auto min-h-0">
      <div v-if="loading && !content" class="onb-loading">
        <SparklesIcon class="w-4 h-4 animate-pulse" /><span>{{ loadingText }}</span>
      </div>
      <div
        v-else-if="failed && !content"
        class="flex flex-col items-center gap-4 text-text-secondary py-8"
      >
        <p class="text-sm">{{ errorText }}</p>
        <Button variant="primary" size="sm" @click="$emit('retry')">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
      <div v-else class="md-rendered" v-html="renderedContent" />
    </div>

    <!-- Feedback -->
    <div v-if="!loading && content && showFeedback" class="onb-feedback">
      <input
        ref="feedbackRef"
        :value="feedback"
        type="text"
        :placeholder="feedbackPlaceholder"
        class="onb-feedback-input"
        @input="$emit('update:feedback', ($event.target as HTMLInputElement).value)"
        @keydown.enter.prevent="feedback.trim() && $emit('regenerate')"
      />
      <button
        type="button"
        class="onb-send-btn"
        :disabled="!feedback.trim() || loading"
        @click="$emit('regenerate')"
      >
        <PaperAirplaneIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Actions -->
    <div v-if="!loading && !streaming && content && !showFeedback" class="onb-actions">
      <Button variant="outline" size="sm" @click="$emit('back')">Atrás</Button>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="$emit('show-feedback')"
          >Quiero cambiar algo</Button
        >
        <Button variant="outline" size="sm" @click="$emit('skip')">Saltar</Button>
        <Button variant="primary" size="sm" @click="$emit('accept')">Sí, adelante</Button>
      </div>
    </div>
    <div v-else-if="!loading && showFeedback" class="onb-actions">
      <Button variant="outline" size="sm" @click="$emit('back')">Atrás</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SparklesIcon, ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { renderPageMarkdown } from '~/utils/markdown'

interface Props {
  content: string
  loading: boolean
  streaming?: boolean
  failed?: boolean
  feedback: string
  showFeedback: boolean
  loadingText?: string
  errorText?: string
  feedbackPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  streaming: false,
  failed: false,
  loadingText: 'Generando...',
  errorText: 'No se pudo generar el contenido.',
  feedbackPlaceholder: 'Escribe tu feedback...',
})

defineEmits<{
  retry: []
  regenerate: []
  back: []
  skip: []
  accept: []
  'show-feedback': []
  'update:feedback': [value: string]
}>()

const renderedContent = computed(() => renderPageMarkdown(props.content))
</script>
