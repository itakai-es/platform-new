<template>
  <button
    data-testid="conversation-item"
    class="w-full text-left p-3 rounded-lg border transition-all duration-200 hover:bg-navy-dark focus:outline-none focus:ring-2 focus:ring-mint"
    :class="[
      isActive
        ? 'border-mint bg-navy-dark shadow-md'
        : 'border-navy-medium bg-transparent hover:border-mint/50',
    ]"
    @click="handleClick"
  >
    <div class="flex items-start justify-between gap-2">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-medium text-text-primary truncate mb-1">
          {{ conversation.title }}
        </h4>
        <div class="flex items-center gap-2 text-xs text-text-secondary">
          <span>{{ assistantName }}</span>
          <span>•</span>
          <span>{{ formattedDate }}</span>
        </div>
        <p v-if="lastMessage" class="text-xs text-text-muted truncate mt-1">
          {{ lastMessage }}
        </p>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="flex-shrink-0 flex items-center gap-1">
        <button
          class="p-1 rounded hover:bg-navy-medium text-text-secondary hover:text-text-primary transition-colors"
          :title="t('common.actions.rename')"
          @click.stop="handleRename"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          class="p-1 rounded hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
          :title="t('common.actions.delete')"
          @click.stop="handleDelete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Conversation } from '~/types/chat.types'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const { t } = useI18n()

interface Props {
  conversation: Conversation
  assistantName: string
  isActive?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showActions: true,
})

const emit = defineEmits<{
  select: [conversation: Conversation]
  rename: [conversation: Conversation]
  delete: [conversation: Conversation]
}>()

const lastMessage = computed(() => {
  const last = props.conversation.messages[props.conversation.messages.length - 1]
  return last?.content || null
})

const formattedDate = computed(() => {
  const date = new Date(props.conversation.updatedAt)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  // Si es menor a 24 horas, mostrar "hace X horas"
  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  }

  // Si es mayor, mostrar fecha
  return format(date, 'd MMM', { locale: es })
})

const handleClick = () => {
  emit('select', props.conversation)
}

const handleRename = () => {
  emit('rename', props.conversation)
}

const handleDelete = () => {
  emit('delete', props.conversation)
}
</script>
