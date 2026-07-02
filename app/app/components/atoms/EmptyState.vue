<template>
  <div class="text-center py-12">
    <component :is="icon" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 class="text-lg font-semibold text-navy-700 mb-2">{{ title }}</h3>
    <p class="text-text-secondary">{{ description }}</p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

interface Props {
  icon?: Component
  title: string
  description: string
}

withDefaults(defineProps<Props>(), {
  icon: () => DocumentTextIcon,
})
</script>
