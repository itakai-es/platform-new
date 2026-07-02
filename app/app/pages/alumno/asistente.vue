<script setup lang="ts">
const { t } = useI18n()

const suggestions = computed(() => [
  t('student.ai_assistant.suggestions.how_to_complete_mission'),
  t('student.ai_assistant.suggestions.where_to_see_progress'),
  t('student.ai_assistant.suggestions.how_xp_works'),
  t('student.ai_assistant.suggestions.how_to_join_class'),
])

useHead({
  title: computed(() => t('student.ai_assistant.meta.title')),
  meta: [
    { name: 'description', content: computed(() => t('student.ai_assistant.meta.description')) },
  ],
})

definePageMeta({
  layout: 'chat',
  middleware: ['auth', 'role'],
})
</script>

<template>
  <AIChatTemplate :suggestions="suggestions" />
</template>
