<template>
  <div class="space-y-6 w-full min-w-0 max-w-full">
    <!-- Page Header -->
    <PageHeader :title="title" :subtitle="subtitle">
      <template #actions>
        <slot name="header-actions" />
      </template>
    </PageHeader>

    <!-- Main Grid: 70/30 on xl+ -->
    <div class="grid grid-cols-1 xl:grid-cols-[7fr_3fr] gap-4 md:gap-6 min-w-0">
      <!-- Left Column -->
      <div class="space-y-4 md:space-y-6 min-w-0">
        <!-- Stats Cards -->
        <CardGrid :cols="statsCols">
          <template v-if="loadingStats">
            <StatCardSkeleton v-for="i in statsCount" :key="i" type="stats" />
          </template>
          <template v-else>
            <slot name="stats" />
          </template>
        </CardGrid>

        <!-- Main content sections -->
        <slot name="main" />
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6 min-w-0">
        <slot name="sidebar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  loadingStats?: boolean
  statsCount?: number
  statsCols?: 'auto' | '2' | '2-wide' | '2x2' | '3' | '3-fixed' | '4' | '6'
}

withDefaults(defineProps<Props>(), {
  loadingStats: false,
  statsCount: 3,
  statsCols: '3',
})
</script>
