<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  currentXp: number
  requiredXp: number
  level: number
  showGain?: boolean
  gainAmount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showGain: false,
  gainAmount: 0,
})

const progress = computed(() => {
  if (props.requiredXp === 0) return 0
  return Math.min(Math.round((props.currentXp / props.requiredXp) * 100), 100)
})

const isAnimating = ref(false)
const displayGainAmount = ref(0)

watch(
  () => props.showGain,
  newVal => {
    if (newVal && props.gainAmount > 0) {
      isAnimating.value = true
      displayGainAmount.value = props.gainAmount
    }
  }
)
</script>

<template>
  <div class="xp-bar-container space-y-2" data-testid="xp-bar">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium" data-testid="xp-level"> Nivel {{ level }} </span>
      <span class="text-text-muted" data-testid="xp-progress">
        {{ currentXp }} / {{ requiredXp }} XP
      </span>
    </div>

    <div class="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="xp-bar-fill absolute left-0 top-0 h-full bg-gradient-to-r from-student via-green-400 to-green-500 transition-all duration-700 ease-out flex items-center justify-end"
        :style="{ width: `${progress}%` }"
        data-testid="xp-bar-fill"
      >
        <div
          v-if="isAnimating"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-text-primary animate-xp-gain"
          data-testid="xp-gain-animation"
        >
          +{{ displayGainAmount }} XP
        </div>
      </div>

      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs font-semibold text-text-secondary mix-blend-difference">
          {{ progress }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xp-bar-fill {
  box-shadow: inset 0 2px 4px 0 rgba(255, 255, 255, 0.2);
}

@keyframes xp-gain {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.animate-xp-gain {
  animation: xp-gain 1.2s ease-out forwards;
}
</style>
