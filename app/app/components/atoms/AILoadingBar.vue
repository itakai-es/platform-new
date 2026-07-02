<template>
  <div class="w-full max-w-xs">
    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div v-if="isOvertime" class="h-full bg-navy-700 rounded-full ai-loading-indeterminate" />
      <div
        v-else
        class="h-full bg-navy-700 rounded-full transition-all duration-200 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <p v-if="isOvertime" class="text-[11px] text-gray-400 mt-1.5 text-center">
      {{ overtimeLabel }}
    </p>
    <p v-else-if="remainingLabel" class="text-[11px] text-gray-400 mt-1.5 text-center">
      {{ remainingLabel }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  isOvertime?: boolean
  remainingLabel?: string
  overtimeLabel?: string
}

withDefaults(defineProps<Props>(), {
  isOvertime: false,
  remainingLabel: '',
  overtimeLabel: 'Tardando más de lo previsto...',
})
</script>

<style scoped>
.ai-loading-indeterminate {
  width: 40%;
  animation: ai-loading-indeterminate 1.4s ease-in-out infinite;
}
@keyframes ai-loading-indeterminate {
  0% {
    margin-left: -40%;
  }
  100% {
    margin-left: 100%;
  }
}
</style>
