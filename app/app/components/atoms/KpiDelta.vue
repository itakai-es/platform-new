<template>
  <p v-if="delta !== 0" class="text-sm font-medium text-navy-700/70">
    {{ isPositive ? '▲' : '▼' }} {{ Math.abs(delta).toFixed(1) }}%
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number
  previous: number
  /** When true, a decrease is good (e.g. response time, error rate) */
  invert?: boolean
}>()

const delta = computed(() => {
  if (props.previous === 0) return 0
  return ((props.current - props.previous) / props.previous) * 100
})

const isPositive = computed(() => (props.invert ? delta.value < 0 : delta.value > 0))
</script>
