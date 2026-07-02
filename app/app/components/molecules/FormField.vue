<template>
  <div>
    <div v-if="label" class="flex items-center justify-between mb-2">
      <label :for="id" class="text-sm font-medium text-text-primary">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </label>

      <a
        v-if="helpLink && helpText"
        :href="helpLink"
        class="text-[0.8125rem] text-navy-700 link-underline transition-colors"
      >
        {{ helpText }}
      </a>
    </div>

    <Input
      :id="id"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :error="!!errorMessage"
      @update:model-value="emit('update:modelValue', $event)"
      @blur="emit('blur')"
    />

    <p v-if="errorMessage" class="mt-1 text-sm text-error">
      {{ errorMessage }}
    </p>

    <p v-else-if="hint" class="mt-1 text-sm text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  errorMessage?: string
  hint?: string
  helpText?: string // Texto del enlace de ayuda (ej: "¿Olvidaste tu contraseña?")
  helpLink?: string // URL del enlace de ayuda
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
}>()
</script>
