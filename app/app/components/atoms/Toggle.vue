<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    :class="toggleClasses"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <span :class="thumbClasses" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const toggleClasses = computed(() => {
  const base =
    'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy-700/30 focus:ring-offset-2'

  const sizeClasses = props.size === 'sm' ? 'h-5 w-9' : 'h-7 w-12'

  const stateClasses = props.modelValue ? 'bg-navy-700' : 'bg-gray-300'

  const disabledClasses = props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'

  return [base, sizeClasses, stateClasses, disabledClasses].join(' ')
})

const thumbClasses = computed(() => {
  const base = 'inline-block rounded-full bg-white shadow-md transition-transform duration-200'

  const sizeClasses = props.size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'

  const positionClasses = props.modelValue
    ? props.size === 'sm'
      ? 'translate-x-[18px]'
      : 'translate-x-6'
    : 'translate-x-1'

  return [base, sizeClasses, positionClasses].join(' ')
})
</script>
