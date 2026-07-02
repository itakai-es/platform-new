<template>
  <CardItem :padding="padding">
    <!-- Avatar/Icon skeleton -->
    <Skeleton
      v-if="showAvatar"
      :width="avatarSize"
      :height="avatarSize"
      :circle="avatarCircle"
      class="flex-shrink-0"
    />

    <!-- Content skeleton -->
    <div class="flex-1 space-y-1">
      <Skeleton :width="primaryWidth" height="h-4" />
      <Skeleton v-if="showSecondary" :width="secondaryWidth" height="h-3" />
    </div>

    <!-- Optional trailing skeleton (badge, icon, etc.) -->
    <Skeleton
      v-if="showTrailing"
      :width="trailingWidth"
      :height="trailingHeight"
      :custom-class="trailingClass"
      class="flex-shrink-0"
    />
  </CardItem>
</template>

<script setup lang="ts">
/**
 * CardItemSkeleton - Loading skeleton for list items inside Cards
 *
 * Provides consistent loading states for activity items, achievement items, etc.
 * Uses CardItem for the container to ensure visual consistency.
 */
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  showAvatar?: boolean
  avatarSize?: string
  avatarCircle?: boolean
  primaryWidth?: string
  showSecondary?: boolean
  secondaryWidth?: string
  showTrailing?: boolean
  trailingWidth?: string
  trailingHeight?: string
  trailingClass?: string
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  showAvatar: true,
  avatarSize: 'w-14',
  avatarCircle: true,
  primaryWidth: 'w-full',
  showSecondary: true,
  secondaryWidth: 'w-24',
  showTrailing: false,
  trailingWidth: 'w-16',
  trailingHeight: 'h-6',
  trailingClass: 'rounded-full',
})
</script>
