<template>
  <div
    :class="['animate-pulse rounded', sizeClasses, customClass]"
    :style="{ backgroundColor: 'var(--color-skeleton)' }"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  circle?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 'w-full',
  height: 'h-4',
  circle: false,
  customClass: '',
})

const sizeClasses = computed(() => {
  if (props.circle) {
    return 'rounded-full'
  }
  return `${props.width} ${props.height}`
})
</script>
