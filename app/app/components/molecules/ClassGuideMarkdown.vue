<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <Skeleton width="w-3/4" height="h-8" class="mb-6" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-5/6" height="h-4" />
      <Skeleton width="w-full" height="h-4" class="mt-6" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-2/3" height="h-4" />
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else-if="!content"
      :icon="DocumentTextIcon"
      :title="t('student.components.class_guide_markdown.empty_title')"
      :description="
        isTeacher
          ? t('student.components.class_guide_markdown.empty_teacher')
          : t('student.components.class_guide_markdown.empty_student')
      "
    >
      <template v-if="isTeacher" #action>
        <Button variant="primary" @click="$emit('add-guide')">
          {{ t('student.components.class_guide_markdown.add_guide_button') }}
        </Button>
      </template>
    </EmptyState>

    <!-- Markdown content -->
    <template v-else>
      <div class="md-rendered" v-html="renderedContent" />

      <!-- Footer -->
      <div v-if="lastUpdated" class="mt-8 pt-4 border-t border-gray-200">
        <p class="text-xs text-text-secondary">
          {{
            t('student.components.class_guide_markdown.last_updated', {
              date: formatDate(lastUpdated),
            })
          }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * ClassGuideMarkdown - Guía de clase en formato Markdown
 *
 * Componente simple que renderiza contenido markdown del profesor.
 * Diseñado para ser flexible y permitir cualquier tipo de contenido.
 */

import { computed } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { renderPageMarkdown } from '~/utils/markdown'

const { t, locale } = useI18n()

// Exported type for use in other components
export interface ClassGuideMarkdownData {
  content: string
  lastUpdated: string
}

interface Props {
  content?: string
  lastUpdated?: string
  loading?: boolean
  isTeacher?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  lastUpdated: '',
  loading: false,
  isTeacher: false,
})

defineEmits<{
  'add-guide': []
}>()

const renderedContent = computed(() => renderPageMarkdown(props.content))

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
