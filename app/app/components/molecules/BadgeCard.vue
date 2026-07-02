<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import Badge from '@/components/atoms/Badge.vue'

const { getImageUrl } = useImageUrl()

export interface BadgeData {
  id: string
  name: string
  description: string
  imageUrl?: string
  icon?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt?: string
  criteria?: string
  progress?: {
    current: number
    total: number
  }
}

interface Props {
  badge: BadgeData
}

interface Emits {
  (e: 'click'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rarityConfig = {
  common: {
    label: 'Común',
    variant: 'default' as const,
    bgColor: 'bg-gray-500',
    shadowColor: 'shadow-gray-200',
  },
  rare: {
    label: 'Raro',
    variant: 'info' as const,
    bgColor: 'bg-blue-500',
    shadowColor: 'shadow-blue-200',
  },
  epic: {
    label: 'Épico',
    variant: 'warning' as const,
    bgColor: 'bg-purple-500',
    shadowColor: 'shadow-purple-200',
  },
  legendary: {
    label: 'Legendario',
    variant: 'success' as const,
    bgColor: 'bg-yellow-500',
    shadowColor: 'shadow-yellow-200',
  },
}

const rarityColor = computed(() => rarityConfig[props.badge.rarity])
const rarityLabel = computed(() => rarityColor.value.label)
const rarityVariant = computed(() => rarityColor.value.variant)
const isUnlocked = computed(() => !!props.badge.earnedAt)
</script>

<template>
  <div
    class="bg-navy-dark rounded-lg p-6 text-center relative cursor-pointer"
    :style="isUnlocked ? {} : { opacity: 0.6 }"
    data-testid="achievement-card"
    @click="emit('click')"
  >
    <!-- Badge Image or Icon -->
    <div class="relative inline-block mb-4">
      <!-- Image variant -->
      <div v-if="badge.imageUrl">
        <div
          class="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden"
        >
          <img
            :src="getImageUrl(badge.imageUrl)"
            :alt="badge.name"
            class="w-full h-full object-cover transition-all"
            :class="!isUnlocked && 'grayscale'"
            data-testid="badge-image"
          />
        </div>
      </div>

      <!-- Emoji icon variant -->
      <div
        v-else-if="badge.icon"
        class="text-4xl"
        :class="!isUnlocked && 'grayscale'"
        data-testid="badge-icon"
      >
        {{ badge.icon }}
      </div>

      <!-- Locked/Unlocked Icon -->
      <div
        v-if="isUnlocked"
        :class="[
          'absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-green-500',
          rarityColor.bgColor,
        ]"
        data-testid="achievement-unlocked"
      >
        <CheckIcon class="w-6 h-6" />
      </div>
      <div
        v-else
        class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-text-muted"
        data-testid="achievement-locked"
      >
        <LockClosedIcon class="w-6 h-6" />
      </div>
    </div>

    <!-- Badge Name -->
    <h3 class="font-bold text-text-primary mb-2 text-lg" data-testid="badge-name">
      {{ badge.name }}
    </h3>

    <!-- Rarity Badge -->
    <Badge :variant="rarityVariant" size="sm" class="mb-3" data-testid="badge-rarity">
      {{ rarityLabel }}
    </Badge>

    <!-- Description -->
    <p class="text-sm text-text-secondary mb-4" data-testid="badge-description">
      {{ badge.description }}
    </p>

    <!-- Unlocked Date -->
    <div v-if="isUnlocked && badge.earnedAt" class="text-xs text-text-muted mt-3">
      Desbloqueado el
      {{
        new Date(badge.earnedAt).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      }}
    </div>

    <!-- Criteria (for locked badges) -->
    <p
      v-else-if="!isUnlocked && badge.criteria"
      class="text-xs text-text-muted"
      data-testid="badge-criteria"
    >
      {{ badge.criteria }}
    </p>
  </div>
</template>
