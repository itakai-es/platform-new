<template>
  <TeacherShopPanel :class-id="classId" :mana-enabled="classSettings.mana" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { classSettings } = useTeacherClassDetail(classId)
</script>
