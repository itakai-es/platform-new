<template>
  <span
    v-if="provider"
    class="inline-flex items-center gap-1 text-[11px] text-gray-400 select-none"
  >
    <svg class="w-3 h-3" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" :fill="ringColor" opacity="0.5" />
      <circle cx="8" cy="8" r="3" :fill="dotColor" />
    </svg>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ provider: 'spark' | 'gemini' | 'flux' | null }>()

const label = computed(() => {
  if (props.provider === 'spark') return 'Spark'
  if (props.provider === 'flux') return 'Flux'
  return 'Gemini'
})

const ringColor = computed(() => {
  if (props.provider === 'spark') return '#6FEDB7'
  if (props.provider === 'flux') return '#FCA5A5'
  return '#60A5FA'
})

const dotColor = computed(() => {
  if (props.provider === 'spark') return '#10B981'
  if (props.provider === 'flux') return '#EF4444'
  return '#3B82F6'
})
</script>
