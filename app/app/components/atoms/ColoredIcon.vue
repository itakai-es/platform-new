<template>
  <component :is="icon" :class="iconClasses" :style="iconStyle" />
</template>

<script setup lang="ts">
interface Props {
  icon: any // Heroicon component
  type: 'ia' | 'stats' | 'pending' | 'clases'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

// Mapa de colores por tipo (en RGB)
const colorMap: Record<string, string> = {
  ia: '254 224 154',
  stats: '212 185 252',
  pending: '255 156 167',
  clases: '108 243 175',
}

const iconClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }
  return sizes[props.size]
})

const iconStyle = computed(() => {
  const color = colorMap[props.type]
  return {
    color: `rgb(${color})`,
  }
})
</script>
