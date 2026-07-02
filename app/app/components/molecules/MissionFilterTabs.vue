<template>
  <div
    class="bg-red-light rounded-2xl p-1.5 xs:p-2 flex items-center gap-1.5 xs:gap-2 overflow-x-auto scrollbar-subtle"
  >
    <!-- Filter Tabs -->
    <div class="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
      <button
        v-for="filter in filters"
        :key="filter.id"
        :class="[
          'px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-xl text-xs xs:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
          isFilterActive(filter.id)
            ? 'bg-navy-700 text-white'
            : 'bg-white/80 text-navy-700 hover:bg-white',
        ]"
        @click="handleFilterClick(filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Mission Count - Hidden on base, number only on xs, full text on sm+ -->
    <div
      class="hidden xs:flex flex-shrink-0 bg-sky text-white px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-xl text-xs xs:text-sm font-semibold whitespace-nowrap"
    >
      <span class="hidden sm:inline">{{ totalMissions }} misiones</span>
      <span class="sm:hidden">{{ totalMissions }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * MissionFilterTabs - Barra de filtros para misiones
 *
 * Barra horizontal con pills para filtrar misiones por categoría.
 * Soporta selección múltiple (excepto "todas" que limpia todos los filtros).
 * Incluye contador de misiones totales.
 */

import type { MissionCategoryFilter } from '~/types/mission.types'

interface Props {
  filters: MissionCategoryFilter[]
  activeFilters: string[]
  totalMissions: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'filter-change': [filterIds: string[]]
}>()

const isFilterActive = (filterId: string): boolean => {
  if (filterId === 'todas') {
    // "Todas" is active when no filters OR when all class filters are selected
    if (props.activeFilters.length === 0) return true
    const classFilterIds = props.filters.filter(f => f.id !== 'todas').map(f => f.id)
    return classFilterIds.every(id => props.activeFilters.includes(id as string))
  }
  return props.activeFilters.includes(filterId)
}

const handleFilterClick = (filterId: string) => {
  if (filterId === 'todas') {
    // Clear all filters
    emit('filter-change', [])
    return
  }

  // Toggle the filter
  const currentFilters = [...props.activeFilters]
  const index = currentFilters.indexOf(filterId)

  if (index === -1) {
    // Add filter
    currentFilters.push(filterId)
  } else {
    // Remove filter
    currentFilters.splice(index, 1)
  }

  emit('filter-change', currentFilters)
}
</script>

<style scoped>
.scrollbar-subtle {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-subtle::-webkit-scrollbar {
  display: none;
}
</style>
