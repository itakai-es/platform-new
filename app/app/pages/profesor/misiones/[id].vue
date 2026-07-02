<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <div
        class="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p class="text-text-secondary">Redirigiendo...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Redirect page: /teacher/missions/[id] -> /teacher/classes/[classId]/missions/[id]
 *
 * This page fetches the mission to get its classId and redirects to the canonical nested URL.
 * Supports legacy links and bookmarks.
 */

definePageMeta({
  layout: 'teacher',
  middleware: ['auth', 'role'],
})

const route = useRoute()
const missionId = route.params.id as string

// If classId is provided as query param, redirect immediately
const queryClassId = route.query.classId as string | undefined

const missionStore = useMissionStore()

onMounted(async () => {
  if (queryClassId) {
    // Redirect with known classId
    await navigateTo(`/profesor/clases/${queryClassId}/misiones/${missionId}`, { replace: true })
    return
  }

  // Fetch mission to get classId (idempotente, usa caché del store)
  try {
    const mission = await missionStore.ensureTeacherMissionById(missionId)

    const classId = mission?.classId
    if (classId) {
      await navigateTo(`/profesor/clases/${classId}/misiones/${missionId}`, { replace: true })
    } else {
      // Fallback: go to missions list if no classId found
      console.warn('Mission has no classId, redirecting to missions list')
      await navigateTo('/profesor/misiones', { replace: true })
    }
  } catch (err) {
    console.error('Error fetching mission for redirect:', err)
    await navigateTo('/profesor/misiones', { replace: true })
  }
})
</script>
