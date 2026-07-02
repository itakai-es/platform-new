<template>
  <Card :type="type">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-text-secondary">{{ title }}</p>
        <p class="text-2xl font-bold text-text-primary mt-1">{{ value }}</p>
        <p v-if="subtitle" class="text-sm text-text-muted mt-1">{{ subtitle }}</p>
      </div>
      <div
        v-if="icon"
        :class="`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`"
      >
        <component :is="icon" :class="`w-6 h-6 ${iconColor}`" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: any
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  type?: 'ia' | 'stats' | 'pending' | 'clases' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'info',
})

const iconBgColor = computed(() => {
  const variants = {
    primary: 'bg-primary/20',
    secondary: 'bg-secondary/20',
    accent: 'bg-accent/20',
    success: 'bg-success/20',
    warning: 'bg-warning/20',
    danger: 'bg-error/20',
    info: 'bg-info/20',
  }
  return variants[props.variant]
})

const iconColor = computed(() => {
  const variants = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-error',
    info: 'text-info',
  }
  return variants[props.variant]
})
</script>
