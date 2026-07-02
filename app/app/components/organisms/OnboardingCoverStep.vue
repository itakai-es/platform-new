<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex-1 flex items-center justify-center min-h-0">
      <!-- Loading skeleton -->
      <div v-if="generating && !imageUrl" class="w-full max-w-md flex flex-col items-center gap-3">
        <div
          class="w-full aspect-video rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center"
        >
          <PhotoIcon class="w-12 h-12 text-gray-300" />
        </div>
        <div class="onb-loading">
          <SparklesIcon class="w-4 h-4 animate-pulse" /><span>{{ loadingText }}</span>
        </div>
      </div>
      <!-- Generated image -->
      <div v-else-if="imageUrl" class="w-full max-w-md">
        <div class="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
          <img :src="imageUrl" alt="" class="w-full h-full object-cover" />
        </div>
      </div>
      <!-- Error with retry -->
      <div v-else-if="failed" class="flex flex-col items-center gap-4 text-text-secondary">
        <PhotoIcon class="w-12 h-12 opacity-40" />
        <p class="text-sm">{{ errorText }}</p>
        <Button variant="primary" size="sm" @click="$emit('retry')">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="!generating && showFeedback" class="onb-feedback">
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
        :disabled="!feedback.trim() || generating"
        @click="$emit('regenerate')"
      >
        <PaperAirplaneIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Actions -->
    <div v-if="!generating && !showFeedback" class="onb-actions">
      <Button variant="outline" size="sm" @click="$emit('back')">Atrás</Button>
      <div class="flex gap-2">
        <Button v-if="imageUrl" variant="outline" size="sm" @click="$emit('show-feedback')"
          >Quiero cambiar algo</Button
        >
        <Button variant="outline" size="sm" @click="$emit('skip')">Saltar</Button>
        <Button v-if="imageUrl" variant="primary" size="sm" @click="$emit('accept')"
          >Sí, adelante</Button
        >
      </div>
    </div>
    <div v-else-if="!generating && showFeedback" class="onb-actions">
      <Button variant="outline" size="sm" @click="$emit('back')">Atrás</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PhotoIcon,
  SparklesIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  generating: boolean
  imageUrl: string
  failed: boolean
  feedback: string
  showFeedback: boolean
  loadingText?: string
  errorText?: string
  feedbackPlaceholder?: string
}

withDefaults(defineProps<Props>(), {
  loadingText: 'Generando portada...',
  errorText: 'No se pudo generar la portada.',
  feedbackPlaceholder: 'Ej: Quiero que sea más oscura, con otro estilo...',
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
</script>
