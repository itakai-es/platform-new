<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Skeleton height="h-96" />
        <Skeleton height="h-96" />
      </div>
      <Skeleton height="h-64" />
    </div>

    <!-- Empty: no students -->
    <EmptyState
      v-else-if="!data || !data.stats || data.stats.totalStudents === 0"
      :icon="UsersIcon"
      :title="t('teacher.classes.detail.ranking.no_students_title')"
      :description="t('teacher.classes.detail.ranking.no_students_description')"
    />

    <ClassRankingSection
      v-else
      :ranking-data="data"
      :clickable="true"
      :show-current-user-highlight="false"
      @student-click="viewStudentProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { UsersIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'

definePageMeta({ layout: 'teacher', middleware: ['auth', 'role'] })

const { t } = useI18n()
const route = useRoute()
const classId = computed(() => route.params.id as string)

// Store (ranking listing lives in the teacher store).
const teacherStore = useTeacherStore()
const { classRankings } = storeToRefs(teacherStore)

// Lectura reactiva del ranking cacheado por el store. La clave del Map es
// `${classId}-${filter}`; aquí siempre usamos el filtro 'general'.
const cacheKey = computed(() => `${classId.value}-general`)
const data = computed(() => classRankings.value.get(cacheKey.value) ?? null)

// Loading local: el store no expone una bandera por clase, así que la
// mantenemos aquí para preservar el comportamiento de UI (skeleton).
const isLoading = ref(true)

function viewStudentProfile(studentId: string) {
  navigateTo(`/profesor/alumnos/${studentId}`)
}

// Si llegamos directo a /ranking, ensureClassRanking() lo dispara; si ya
// estaba cargado, es no-op (cache hit).
onMounted(async () => {
  try {
    await teacherStore.ensureClassRanking(classId.value)
  } finally {
    isLoading.value = false
  }
})
</script>
