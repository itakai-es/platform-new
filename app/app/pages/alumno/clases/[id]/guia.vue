<template>
  <ClassGuideMarkdown
    :content="classGuide?.content"
    :last-updated="classGuide?.lastUpdated"
    :loading="false"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'student', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { classGuide } = useStudentClassDetail(classId)
</script>
