<template>
  <div :class="cardClasses">
    <!-- Title Section -->
    <div class="profile-header">
      <h3 :class="titleClasses">
        {{ title }}
      </h3>
      <div class="profile-subtitle" :class="subtitleClasses">
        {{ subtitle }}
      </div>
    </div>

    <!-- Features List -->
    <div class="features-list">
      <div v-for="(feature, index) in features" :key="index" class="feature-item">
        <svg class="checkmark" :class="checkmarkClasses" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="feature-text">{{ feature }}</span>
      </div>
    </div>

    <!-- CTA Button -->
    <div class="profile-cta">
      <Button :variant="buttonVariant" size="md" class="w-full">
        {{ ctaText }}
      </Button>
    </div>

    <!-- Illustration/Icon (placeholder for now) -->
    <div class="profile-illustration" :class="illustrationBgClasses">
      <div :class="iconWrapperClasses">
        <component :is="iconComponent" class="w-16 h-16 md:w-20 md:h-20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AcademicCapIcon, UserIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

/**
 * ProfileCard - ITAKAI Design System
 *
 * Card grande para perfiles (Docente, Estudiante, Padre/Madre)
 *
 * Props:
 * - variant: 'teacher' | 'student' | 'parent' - Tipo de perfil
 * - title: string - Título del perfil
 * - subtitle: string - Subtítulo del perfil
 * - features: string[] - Lista de features
 * - ctaText: string - Texto del botón CTA
 */

interface Props {
  variant: 'teacher' | 'student' | 'parent'
  title: string
  subtitle: string
  features: string[]
  ctaText: string
}

const props = defineProps<Props>()

// Card classes según variante
const cardClasses = computed(() => {
  const baseClasses = 'profile-card relative overflow-hidden rounded-3xl p-6 md:p-8'
  const variantClasses = {
    teacher: 'bg-white border-2 border-gold',
    student: 'bg-white border-2 border-mint',
    parent: 'bg-white border-2 border-lila-medium',
  }
  return `${baseClasses} ${variantClasses[props.variant]}`
})

// Title classes según variante
const titleClasses = computed(() => {
  const baseClasses = 'text-2xl md:text-3xl font-bold mb-2'
  const variantClasses = {
    teacher: 'text-gold',
    student: 'text-mint',
    parent: 'text-lila-medium',
  }
  return `${baseClasses} ${variantClasses[props.variant]}`
})

// Subtitle classes
const subtitleClasses = computed(() => {
  return 'text-gray-600 text-sm md:text-base'
})

// Checkmark classes según variante
const checkmarkClasses = computed(() => {
  const variantClasses = {
    teacher: 'text-gold',
    student: 'text-mint',
    parent: 'text-lila-medium',
  }
  return variantClasses[props.variant]
})

// Button variant según profile variant
const buttonVariant = computed(() => {
  const variantMap = {
    teacher: 'secondary-yellow' as const,
    student: 'secondary' as const, // Mint (ya existe)
    parent: 'secondary-lilac' as const,
  }
  return variantMap[props.variant]
})

// Icon component según variante
const iconComponent = computed(() => {
  const iconMap = {
    teacher: AcademicCapIcon,
    student: UserIcon,
    parent: UserGroupIcon,
  }
  return iconMap[props.variant]
})

// Illustration background classes
const illustrationBgClasses = computed(() => {
  const variantClasses = {
    teacher: 'bg-gold/10',
    student: 'bg-mint/10',
    parent: 'bg-lila-medium/10',
  }
  return variantClasses[props.variant]
})

// Icon wrapper classes
const iconWrapperClasses = computed(() => {
  const variantClasses = {
    teacher: 'text-gold',
    student: 'text-mint',
    parent: 'text-lila-medium',
  }
  return variantClasses[props.variant]
})
</script>

<style scoped>
.profile-card {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.profile-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-subtitle {
  line-height: 1.5;
}

.features-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.feature-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.5;
}

.profile-cta {
  margin-bottom: 1.5rem;
}

.profile-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .profile-card {
    min-height: 450px;
  }

  .feature-text {
    font-size: 0.875rem;
  }
}
</style>
