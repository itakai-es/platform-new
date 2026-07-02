<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <div
        class="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p class="text-text-secondary">{{ $t('student.missions.redirect.redirecting') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Redirect page: /student/missions/[id] -> /student/classes/[classId]/missions/[id]
 *
 * This page fetches the mission to get its classId and redirects to the canonical nested URL.
 * Supports legacy links and bookmarks.
 */

definePageMeta({
  layout: 'student',
  middleware: ['auth', 'role'],
})

const route = useRoute()
const missionId = route.params.id as string
const missionStore = useMissionStore()

// If classId is provided as query param, redirect immediately
const queryClassId = route.query.classId as string | undefined

onMounted(async () => {
  if (queryClassId) {
    // Redirect with known classId
    await navigateTo(`/alumno/clases/${queryClassId}/misiones/${missionId}`, { replace: true })
    return
  }

  // Fetch mission using store (uses cache via ensureMissionById)
  try {
    const mission = await missionStore.ensureMissionById(missionId)

    const classId = mission?.classId
    if (classId) {
      await navigateTo(`/alumno/clases/${classId}/misiones/${missionId}`, { replace: true })
    } else {
      // Fallback: go to missions list if no classId found
      console.warn('Mission has no classId, redirecting to missions list')
      await navigateTo('/alumno/misiones', { replace: true })
    }
  } catch (err) {
    console.error('Error fetching mission for redirect:', err)
    await navigateTo('/alumno/misiones', { replace: true })
  }
})
</script>
