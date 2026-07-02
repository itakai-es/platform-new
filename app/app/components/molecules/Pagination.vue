<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-between pt-4" aria-label="Paginación">
    <div class="text-sm text-text-secondary">Página {{ currentPage }} de {{ totalPages }}</div>

    <div class="flex items-center gap-1">
      <!-- Previous -->
      <button
        :disabled="currentPage <= 1"
        class="px-3 py-1.5 text-sm rounded-lg border border-border-primary text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="$emit('pageChange', currentPage - 1)"
      >
        Anterior
      </button>

      <!-- Page Numbers -->
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 py-1.5 text-sm text-text-secondary"> ... </span>
        <button
          v-else
          :class="[
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            page === currentPage
              ? 'bg-purple text-white font-semibold'
              : 'border border-border-primary text-text-primary hover:bg-surface-hover',
          ]"
          @click="$emit('pageChange', page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="currentPage >= totalPages"
        class="px-3 py-1.5 text-sm rounded-lg border border-border-primary text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="$emit('pageChange', currentPage + 1)"
      >
        Siguiente
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

defineEmits<{
  pageChange: [page: number]
}>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
})
</script>
