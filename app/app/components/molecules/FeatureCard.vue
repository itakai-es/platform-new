<template>
  <div class="feature-card">
    <!-- Icon -->
    <div class="icon-wrapper">
      <component :is="iconComponent" class="w-12 h-12 md:w-16 md:h-16 text-red" />
    </div>

    <!-- Title -->
    <h3 class="feature-title">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="feature-description">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  SparklesIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'

/**
 * FeatureCard - ITAKAI Design System
 *
 * Card de feature con icono, título y descripción
 *
 * Props:
 * - icon: string - Nombre del icono ('gamepad', 'swords', 'family', 'chart', 'monitor', 'robot')
 * - title: string - Título del feature
 * - description: string - Descripción del feature
 */

interface Props {
  icon: 'gamepad' | 'swords' | 'family' | 'chart' | 'monitor' | 'robot'
  title: string
  description: string
}

const props = defineProps<Props>()

// Mapear iconos a componentes Heroicons
const iconComponent = computed(() => {
  const iconMap = {
    gamepad: SparklesIcon, // Usamos SparklesIcon como aproximación a gamificación
    swords: BookOpenIcon, // BookOpenIcon para narrativa
    family: UserGroupIcon,
    chart: ChartBarIcon,
    monitor: ComputerDesktopIcon,
    robot: CpuChipIcon,
  }

  return iconMap[props.icon]
})
</script>

<style scoped>
.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.icon-wrapper {
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1f3a;
  margin-bottom: 0.75rem;
}

.feature-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 280px;
}

@media (max-width: 768px) {
  .feature-card {
    padding: 1.5rem 1rem;
  }

  .feature-title {
    font-size: 1.125rem;
  }

  .feature-description {
    font-size: 0.875rem;
  }
}
</style>
