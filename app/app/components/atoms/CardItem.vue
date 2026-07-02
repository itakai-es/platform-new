<template>
  <div :class="itemClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * CardItem - White rounded box container for items inside colored Cards
 *
 * Used for list items, activity items, achievement items, etc.
 * Provides consistent styling for content boxes within Card components.
 *
 * Padding options:
 * - 'sm': p-3 (12px)
 * - 'md': p-3 sm:p-4 (12px mobile, 16px desktop) - DEFAULT
 * - 'lg': p-4 sm:p-6 (16px mobile, 24px desktop)
 *
 * Use `flex` prop when CardItem needs to stretch inside a flex Card
 */
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  layout?: 'row' | 'column'
  centered?: boolean
  flex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  layout: 'row',
  centered: false,
  flex: false,
})

const itemClasses = computed(() => {
  const base = 'bg-white rounded-xl'

  const paddings = {
    sm: 'p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
  }

  const layouts = {
    row: 'flex items-center gap-3',
    column: 'flex flex-col',
  }

  const center = props.centered ? 'text-center' : ''
  const flexClass = props.flex ? 'flex-1' : ''

  return [base, paddings[props.padding], layouts[props.layout], center, flexClass]
    .filter(Boolean)
    .join(' ')
})
</script>
