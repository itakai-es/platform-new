<template>
  <button
    :data-testid="`assistant-card`"
    class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      isSelected
        ? 'border-mint bg-navy-dark shadow-lg shadow-mint/20'
        : 'border-navy-medium bg-navy-dark/50 hover:border-mint/50',
      !assistant.available && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="!assistant.available"
    @click="handleClick"
  >
    <div class="flex items-start gap-3">
      <!-- Avatar -->
      <Avatar size="md" :username="assistant.name" class="flex-shrink-0" />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Name and Title -->
        <h3 class="text-lg font-semibold text-text-primary mb-1">
          {{ assistant.name }}
        </h3>
        <p class="text-sm text-text-secondary mb-2">
          {{ assistant.title }}
        </p>

        <!-- Description -->
        <p class="text-sm text-text-secondary mb-3 line-clamp-2">
          {{ assistant.description }}
        </p>

        <!-- Specialties -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="specialty in assistant.specialties.slice(0, 3)"
            :key="specialty"
            data-testid="specialty-badge"
            class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-navy-medium text-text-secondary"
          >
            {{ specialty }}
          </span>
          <span
            v-if="assistant.specialties.length > 3"
            class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-text-secondary"
          >
            +{{ assistant.specialties.length - 3 }}
          </span>
        </div>

        <!-- Unavailable Badge -->
        <div v-if="!assistant.available" class="mt-2">
          <span
            class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400"
          >
            Próximamente
          </span>
        </div>
      </div>

      <!-- Selected Indicator -->
      <div v-if="isSelected" class="flex-shrink-0">
        <svg class="w-6 h-6 text-mint" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Assistant } from '~/types/chat.types'

interface Props {
  assistant: Assistant
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<{
  select: [assistant: Assistant]
}>()

const handleClick = () => {
  if (props.assistant.available) {
    emit('select', props.assistant)
  }
}
</script>
