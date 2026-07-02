<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    class="!w-full !block !min-w-0 !max-w-full box-border px-4 py-3 border rounded-2xl outline-none bg-white text-text-primary placeholder:text-text-muted text-sm sm:text-base resize-none transition-colors duration-200"
    :class="[
      error
        ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
        : 'border-border-primary focus:border-primary focus:ring-2 focus:ring-primary/20',
      disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' : '',
    ]"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  rows?: number
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  error: false,
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>
