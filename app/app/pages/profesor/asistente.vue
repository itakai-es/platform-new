<script setup lang="ts">
const { t, tm, rt } = useI18n()

const suggestions = computed(() =>
  (tm('chat.interface.teacher_suggestions') as unknown[]).map(msg => rt(msg as string))
)

useHead({
  title: () => t('teacher.ai_assistant.meta.title'),
  meta: [{ name: 'description', content: () => t('teacher.ai_assistant.meta.description') }],
})

definePageMeta({
  layout: 'chat',
  middleware: ['auth', 'onboarding', 'role'],
})
</script>

<template>
  <AIChatTemplate :suggestions="suggestions" />
</template>
