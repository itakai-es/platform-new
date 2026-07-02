<template>
  <div ref="dropdownRef" class="relative">
    <!-- Trigger Button -->
    <button type="button" :disabled="disabled" :class="triggerClasses" @click="toggleDropdown">
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronDownIcon
        :class="[
          'w-4 h-4 text-navy-700/60 transition-transform duration-200 flex-shrink-0',
          isOpen ? 'rotate-180' : '',
        ]"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="py-1 max-h-60 overflow-y-auto">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            :class="[
              'w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 flex items-center gap-3',
              modelValue === option.value
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-navy-700 hover:bg-gray-50',
            ]"
            @click="selectOption(option)"
          >
            <CheckIcon
              v-if="modelValue === option.value"
              class="w-4 h-4 text-primary flex-shrink-0"
            />
            <span :class="modelValue !== option.value ? 'ml-7' : ''">
              {{ option.label }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccionar...',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label || props.placeholder
})

const triggerClasses = computed(() => {
  const base =
    'w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-2xl text-sm sm:text-base flex items-center justify-between gap-2 transition-colors duration-200 outline-none'
  const normal = 'border-border-primary bg-surface text-text-primary'
  const active = 'border-primary bg-surface text-text-primary ring-2 ring-primary/20'
  const disabledStyle = 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'

  return [base, props.disabled ? disabledStyle : isOpen.value ? active : normal].join(' ')
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>
