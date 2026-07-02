<template>
  <ClassGuideMarkdown
    :content="classData?.narrative"
    :last-updated="classData?.updatedAt"
    :loading="false"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'student', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { classData } = useStudentClassDetail(classId)
</script>
