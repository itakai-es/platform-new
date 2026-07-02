<template>
  <div :class="avatarClasses">
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-contain p-1" />
    <span v-else class="text-text-primary font-bold">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  size?: 'xs' | 'md' | 'lg'
  username?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Avatar',
})

const avatarClasses = computed(() => {
  const base = 'rounded-full bg-lila-medium flex items-center justify-center overflow-hidden'

  const sizes = {
    xs: 'w-9 h-9 text-xs', // 36px - listado/hijos
    md: 'w-15 h-15 text-sm', // 60px - sidebar/panel
    lg: 'w-26 h-26 text-xl', // 104px - perfil
  }

  return [base, sizes[props.size]].join(' ')
})

const initials = computed(() => {
  if (!props.username) return '?'
  return props.username.slice(0, 2).toUpperCase()
})
</script>
