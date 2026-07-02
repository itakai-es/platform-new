<template>
  <Modal
    :model-value="modelValue"
    :title="t('common.invite_students_modal.title')"
    size="sm"
    theme="light"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <p class="text-text-secondary text-sm text-center">
        {{ t('common.invite_students_modal.description') }}
      </p>

      <div class="bg-gray-100 rounded-xl p-6 text-center">
        <p class="text-4xl font-bold text-navy-700 tracking-widest font-mono">
          {{ invitationCode }}
        </p>
      </div>

      <Button variant="primary" class="w-full" @click="handleCopyCode">
        <ClipboardDocumentIcon class="w-4 h-4 mr-2" />
        {{ t('common.invite_students_modal.copy_code') }}
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

interface Props {
  modelValue: boolean
  classId: string
  invitationCode: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  codeCopied: []
}>()

const toast = useToast()

const handleCopyCode = async () => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.invitationCode)
    } else {
      // Fallback for non-HTTPS contexts
      const textArea = document.createElement('textarea')
      textArea.value = props.invitationCode
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    toast.success(t('common.invite_students_modal.code_copied'))
    emit('codeCopied')
  } catch {
    toast.error(t('common.invite_students_modal.copy_error'))
  }
}
</script>
