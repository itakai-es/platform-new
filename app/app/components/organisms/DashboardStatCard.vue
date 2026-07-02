<template>
  <Card :type="type">
    <div class="flex items-center justify-between mb-2">
      <ColoredIcon :icon="icon" :type="type" size="lg" />
      <span class="text-2xl font-bold text-text-primary">
        {{ formattedValue }}
      </span>
    </div>
    <div class="text-sm text-text-secondary">{{ label }}</div>

    <div v-if="growth" class="mt-2 flex items-center gap-2 text-xs">
      <span class="text-green-400">{{ growth }}</span>
    </div>

    <slot name="extra" />
  </Card>
</template>

<script setup lang="ts">
interface Props {
  icon: any
  type: 'ia' | 'stats' | 'pending' | 'clases'
  value: string | number
  label: string
  growth?: string
  suffix?: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  const val = typeof props.value === 'number' ? props.value.toLocaleString() : props.value
  return props.suffix ? `${val}${props.suffix}` : val
})
</script>
