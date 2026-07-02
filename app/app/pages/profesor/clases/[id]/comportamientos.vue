<template>
  <BehaviorsPanel
    :class-id="classId"
    :students="state.students"
    :settings="classSettings"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { state, classSettings } = useTeacherClassDetail(classId)
</script>
