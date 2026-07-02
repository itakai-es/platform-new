<template>
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div class="flex items-center gap-2 min-w-0">
      <component :is="icon" v-if="icon" class="w-5 h-5 sm:w-6 sm:h-6 text-navy-700 flex-shrink-0" />
      <component :is="titleTag" class="text-2xl sm:text-3xl font-bold text-navy-700">
        {{ title }}
      </component>
    </div>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  icon?: Component
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
})
</script>
