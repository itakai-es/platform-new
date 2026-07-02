<template>
  <!-- XP/Mission badge (gold pill style) -->
  <div
    v-if="type === 'xp' || type === 'mission'"
    class="flex items-center px-3 py-1.5 rounded-full flex-shrink-0 bg-yellow-light"
  >
    <span class="text-xs font-bold text-yellow-dark">{{ text }}</span>
  </div>

  <!-- New student badge -->
  <div
    v-else-if="type === 'new'"
    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-shrink-0 bg-purple/20"
  >
    <UserPlusIcon class="w-4 h-4 text-purple" />
    <span class="text-xs font-semibold text-purple">{{ text }}</span>
  </div>

  <!-- Level up badge -->
  <div
    v-else-if="type === 'level'"
    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-shrink-0 bg-sky-light/20"
  >
    <ArrowTrendingUpIcon class="w-4 h-4 text-sky" />
    <span class="text-xs font-semibold text-sky">{{ text }}</span>
  </div>

  <!-- Achievement badge (with image) -->
  <div v-else-if="type === 'achievement' && image" class="flex-shrink-0">
    <img :src="image" :alt="text" class="w-14 h-14 drop-shadow-md" />
  </div>

  <!-- Achievement badge (without image - text fallback) -->
  <div
    v-else-if="type === 'achievement'"
    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-shrink-0 bg-amber-100"
  >
    <TrophyIcon class="w-4 h-4 text-amber-600" />
    <span class="text-xs font-semibold text-amber-600">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { UserPlusIcon, ArrowTrendingUpIcon, TrophyIcon } from '@heroicons/vue/24/outline'

/**
 * ActivityBadge - Badge indicators for activity items
 *
 * Types:
 * - 'xp': Gold pill for XP rewards
 * - 'mission': Gold pill for mission completion
 * - 'new': Purple badge for new students
 * - 'level': Blue badge for level ups
 * - 'achievement': Amber badge or image for achievements
 */
export interface ActivityBadgeType {
  type: 'xp' | 'new' | 'level' | 'mission' | 'achievement' | 'behavior'
  text: string
  image?: string
  /** Solo para 'behavior': true = positivo (pulgar arriba), false = negativo. */
  positive?: boolean
}

interface Props {
  type: 'xp' | 'new' | 'level' | 'mission' | 'achievement'
  text: string
  image?: string
}

defineProps<Props>()
</script>
