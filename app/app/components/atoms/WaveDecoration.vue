<template>
  <div :class="wrapperClasses">
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      class="w-full h-full"
    >
      <path :d="wavePath" :fill="fillColor" />
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * WaveDecoration - ITAKAI Design System
 *
 * Ola decorativa SVG para separar secciones
 *
 * Props:
 * - direction: 'top' | 'bottom' - Dirección de la ola
 * - color: 'white' | 'navy' | 'blue' | 'gray' - Color de la ola
 * - height: Altura en píxeles (default: 120px)
 */

interface Props {
  direction?: 'top' | 'bottom'
  color?: 'white' | 'navy' | 'blue' | 'gray'
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'bottom',
  color: 'white',
  height: 120,
})

// Wrapper classes con altura
const wrapperClasses = computed(() => {
  const position = props.direction === 'top' ? 'top-0' : 'bottom-0'
  return `absolute left-0 right-0 ${position} w-full pointer-events-none`
})

// Color de fill según prop
const fillColor = computed(() => {
  const colors = {
    white: '#FFFFFF',
    navy: '#0A0E27',
    blue: '#1A1F3A',
    gray: '#e5e6eb',
  }
  return colors[props.color]
})

// Path de la ola (cambia según dirección)
const wavePath = computed(() => {
  if (props.direction === 'top') {
    // Ola apuntando hacia abajo (parte superior de sección)
    return 'M0,60 C360,20 720,100 1080,60 C1260,40 1440,80 1440,80 L1440,0 L0,0 Z'
  } else {
    // Ola apuntando hacia arriba (parte inferior de sección)
    return 'M0,40 C360,80 720,0 1080,40 C1260,60 1440,20 1440,20 L1440,120 L0,120 Z'
  }
})
</script>

<style scoped>
/* Asegurar que el SVG se escale correctamente */
svg {
  display: block;
}
</style>
