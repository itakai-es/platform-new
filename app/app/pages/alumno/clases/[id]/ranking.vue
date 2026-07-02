<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="ui.isLoadingRanking" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton height="h-64" />
        <Skeleton height="h-64" />
      </div>
      <Skeleton height="h-96" />
    </div>

    <ClassRankingSection
      v-else-if="ui.rankingData"
      :ranking-data="ui.rankingData"
      :show-current-user-highlight="true"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'student', middleware: ['auth', 'role'] })

const route = useRoute()
const classId = computed(() => route.params.id as string)
const { ui, ensureRanking } = useStudentClassDetail(classId)

// Si llegamos directo a /ranking, ensureRanking() lo dispara; si ya estaba, no-op.
onMounted(() => void ensureRanking())
</script>
