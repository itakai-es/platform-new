<template>
  <Modal
    :model-value="modelValue"
    :title="t('common.join_class_modal.title')"
    size="sm"
    theme="light"
    @update:model-value="handleModalUpdate"
    @close="handleClose"
  >
    <div class="space-y-4">
      <p class="text-text-secondary text-sm text-center">
        {{ t('common.join_class_modal.description') }}
      </p>

      <!-- Code Input -->
      <div>
        <input
          id="class-code"
          v-model="classCode"
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple uppercase text-center text-lg font-mono tracking-wider"
          :placeholder="t('common.join_class_modal.placeholder')"
          maxlength="10"
          :disabled="isSubmitting"
          @input="classCode = classCode.toUpperCase()"
        />
        <p v-if="errorMessage" class="mt-2 text-sm text-red text-center">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Action Button -->
      <Button
        variant="primary"
        class="w-full"
        :disabled="isSubmitting || !classCode.trim()"
        @click="handleSubmit"
      >
        <template v-if="isSubmitting">
          <span
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
          />
          {{ t('common.join_class_modal.joining') }}
        </template>
        <template v-else>
          {{ t('common.join_class_modal.join_button') }}
        </template>
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// Store
const classesStore = useClassesStore()
const toast = useToast()
const effects = useEffects()

// State
const classCode = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

// Handle modal visibility update
const handleModalUpdate = (value: boolean) => {
  if (!value) {
    resetState()
  }
  emit('update:modelValue', value)
}

// Handle form submission
const handleSubmit = async () => {
  // Validate
  errorMessage.value = ''

  if (!classCode.value.trim()) {
    errorMessage.value = t('common.join_class_modal.error_required')
    return
  }

  if (classCode.value.trim().length < 4) {
    errorMessage.value = t('common.join_class_modal.error_min_length')
    return
  }

  isSubmitting.value = true

  try {
    const result = await classesStore.joinClass({ code: classCode.value.trim().toUpperCase() })

    const className = result?.class?.name || ''
    const classId = result?.class?.id

    // Celebración al unirse, respetando los ajustes de la clase (visualEffects/sounds).
    effects.play('class_joined', { settings: result?.class?.settings })

    toast.success(t('common.join_class_modal.success', { className }))
    emit('success')
    handleClose()

    // Redirect immediately to the class
    if (classId) {
      navigateTo(`/alumno/clases/${classId}`)
    }
  } catch (error: any) {
    // Handle specific errors
    if (error?.data?.message) {
      errorMessage.value = error.data.message
      toast.error(error.data.message)
    } else if (error?.statusCode === 404) {
      errorMessage.value = t('common.join_class_modal.error_not_found')
      toast.error(t('common.join_class_modal.error_invalid_code'))
    } else if (error?.statusCode === 409) {
      errorMessage.value =
        error.data?.message || t('common.join_class_modal.error_already_enrolled')
      toast.error(errorMessage.value)
    } else {
      errorMessage.value = t('common.join_class_modal.error_generic')
      toast.error(t('common.join_class_modal.error_generic_short'))
    }
  } finally {
    isSubmitting.value = false
  }
}

// Reset state
const resetState = () => {
  classCode.value = ''
  errorMessage.value = ''
}

// Handle modal close
const handleClose = () => {
  resetState()
  emit('update:modelValue', false)
}
</script>
