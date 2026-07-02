<template>
  <div class="flex flex-col h-[calc(100vh-64px)]">
    <!-- Header -->
    <slot name="header" />

    <!-- Wizard -->
    <div v-if="!showPreview" class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
      <div class="w-full max-w-4xl mx-auto">
        <!-- Progress: mobile = compact bar + counter, desktop = full circles -->
        <!-- Mobile -->
        <div class="sm:hidden flex items-center gap-3 mb-5">
          <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-navy-700 rounded-full transition-all duration-300"
              :style="{ width: `${((step + 1) / totalSteps) * 100}%` }"
            />
          </div>
          <span class="text-sm font-semibold text-navy-700 whitespace-nowrap"
            >{{ step + 1 }}/{{ totalSteps }}</span
          >
        </div>
        <!-- Desktop -->
        <div class="hidden sm:flex items-center justify-center gap-3 mb-5">
          <template v-for="i in totalSteps" :key="i">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold"
              :class="
                i - 1 < step
                  ? 'bg-navy-700 text-white'
                  : i - 1 === step
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-200 text-gray-400'
              "
            >
              <CheckIcon v-if="i - 1 < step" class="w-3.5 h-3.5" />
              <span v-else>{{ i }}</span>
            </div>
            <div
              v-if="i < totalSteps"
              class="w-8 h-0.5 rounded-full"
              :class="i - 1 < step ? 'bg-navy-700' : 'bg-gray-200'"
            />
          </template>
        </div>

        <!-- Card -->
        <div class="flex flex-col min-h-0 bg-white rounded-2xl shadow-lg border border-gray-100">
          <!-- God + question -->
          <div class="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 overflow-hidden"
              :class="godBgClass"
            >
              <img :src="godAvatar" :alt="godName" class="w-full h-full object-contain" />
            </div>
            <p class="flex-1 text-base sm:text-lg font-semibold text-navy-700 leading-snug pt-1">
              {{ question }}
            </p>
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 min-h-0">
            <Transition name="fade" mode="out-in">
              <slot />
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
      <div class="max-w-4xl mx-auto">
        <slot name="preview" />
      </div>
    </div>

    <!-- Modals -->
    <slot name="modals" />
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

interface Props {
  step: number
  totalSteps: number
  question: string
  godName: string
  godAvatar: string
  godBgClass?: string
  showPreview: boolean
}

withDefaults(defineProps<Props>(), {
  godBgClass: 'bg-white/30',
})
</script>
