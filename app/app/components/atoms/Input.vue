<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :min="min"
    :max="max"
    :autocomplete="autocomplete"
    :class="inputClasses"
    @input="handleInput"
    @blur="handleBlur"
    @keydown="$emit('keydown', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  min?: string
  max?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  error: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  keydown: [event: KeyboardEvent]
}>()

const inputClasses = computed(() => {
  const base =
    'block w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-2xl transition-colors duration-200 outline-none bg-surface text-text-primary placeholder:text-text-muted text-sm sm:text-base'
  const normal = 'border-border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
  const errorStyle = 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
  const disabledStyle = 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'

  return [base, props.error ? errorStyle : normal, props.disabled ? disabledStyle : ''].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>
