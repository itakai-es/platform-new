<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * CardGrid - Consistent grid layout for card components
 *
 * Use this for grids of MissionCards, ClassCards, StudentCards, etc.
 * Ensures consistent spacing (gap-6 = 24px) across the app.
 *
 * Columns:
 * - 'auto': 1 col mobile, 2 tablet, 3 desktop (default)
 * - '2': 1 col mobile, 2 tablet+
 * - '2x2': Always 2 cols (for stats grids)
 * - '3': 1 col mobile, 2 tablet, 3 desktop
 * - '3-fixed': Always 3 cols (for small stat cards)
 * - '4': 1 col mobile, 2 tablet, 3 desktop, 4 xl
 * - '6': 2 col mobile, 3 tablet, 4 desktop, 5 lg, 6 xl (for badges)
 */
interface Props {
  cols?: 'auto' | '2' | '2-wide' | '2x2' | '3' | '3-fixed' | '4' | '6'
  flex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cols: 'auto',
  flex: false,
})

const gridClasses = computed(() => {
  const base = 'grid gap-6'

  const colsMap: Record<string, string> = {
    auto: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    '2': 'grid-cols-1 md:grid-cols-2',
    '2-wide': 'grid-cols-1 xl:grid-cols-2',
    '2x2': 'grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    '3-fixed': 'grid-cols-1 sm:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
    '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  }

  const flexClass = props.flex ? 'flex-1' : ''

  return `${base} ${colsMap[props.cols]} ${flexClass}`.trim()
})
</script>
