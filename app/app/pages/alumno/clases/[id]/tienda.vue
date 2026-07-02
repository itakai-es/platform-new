<template>
  <StudentShopPanel
    :class-id="classId"
    :mana-enabled="classSettings.mana"
    :settings="classSettings"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'student', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { classSettings } = useStudentClassDetail(classId)
</script>
