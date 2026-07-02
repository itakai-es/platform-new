/**
 * Composable for mission filtering and sorting logic
 * Reusable across all mission listing pages
 */

export interface MissionFilterState {
  search: string
  rarities: string[]
  statuses: string[] // Filter by status: activa, completada, expirada, etc.
  classes?: string[]
  sort: string
}

export interface FilterableMission {
  id: string
  title: string
  description?: string
  rarity: string
  status?: string // Mission status: activa, completada, expirada, bloqueada, urgente
  xpReward?: number
  deadline?: string | null
  timeRemaining?: string | null
  classId?: string
  className?: string
  [key: string]: any
}

// Rarity order for sorting
const RARITY_ORDER: Record<string, number> = {
  comun: 1,
  rara: 2,
  epica: 3,
  legendaria: 4,
}

export function useMissionFilters<T extends FilterableMission>(
  missions: Ref<T[]>,
  initialSort: string = 'deadline-asc'
) {
  // Filter state
  const filters = ref<MissionFilterState>({
    search: '',
    rarities: [],
    statuses: [],
    classes: [],
    sort: initialSort,
  })

  // Check if any filters are active
  const hasActiveFilters = computed(() => {
    return (
      filters.value.search.trim() !== '' ||
      filters.value.rarities.length > 0 ||
      filters.value.statuses.length > 0 ||
      (filters.value.classes?.length ?? 0) > 0
    )
  })

  // Filtered and sorted missions
  const filteredMissions = computed(() => {
    let result = [...missions.value]

    // Filter by class
    if (filters.value.classes && filters.value.classes.length > 0) {
      result = result.filter(m => m.classId && filters.value.classes!.includes(m.classId))
    }

    // Filter by rarity
    if (filters.value.rarities.length > 0) {
      result = result.filter(m => filters.value.rarities.includes(m.rarity))
    }

    // Filter by status
    if (filters.value.statuses.length > 0) {
      result = result.filter(m => m.status && filters.value.statuses.includes(m.status))
    }

    // Filter by search
    if (filters.value.search.trim()) {
      const query = filters.value.search.toLowerCase().trim()
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query) ||
          m.className?.toLowerCase().includes(query)
      )
    }

    // Sort
    const [field, order] = filters.value.sort.split('-')
    result.sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'es')
          break
        case 'xp':
          comparison = (a.xpReward || 0) - (b.xpReward || 0)
          break
        case 'deadline':
          // Handle both deadline string and timeRemaining
          const aDate = a.deadline || a.timeRemaining
          const bDate = b.deadline || b.timeRemaining
          if (!aDate && !bDate) comparison = 0
          else if (!aDate) comparison = 1
          else if (!bDate) comparison = -1
          else if (a.deadline && b.deadline) {
            comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          } else {
            comparison = String(aDate).localeCompare(String(bDate))
          }
          break
        case 'rarity':
          comparison = (RARITY_ORDER[a.rarity] || 0) - (RARITY_ORDER[b.rarity] || 0)
          break
      }

      return order === 'desc' ? -comparison : comparison
    })

    return result
  })

  // Reset filters (keeps sort)
  const resetFilters = () => {
    filters.value = {
      search: '',
      rarities: [],
      statuses: [],
      classes: [],
      sort: filters.value.sort,
    }
  }

  // Get empty state message
  const getEmptyMessage = (defaultMessage: string = 'No hay misiones') => {
    if (filters.value.search.trim()) {
      return `No se encontraron misiones para "${filters.value.search}"`
    }
    if (filters.value.rarities.length > 0) {
      return 'No hay misiones con las rarezas seleccionadas'
    }
    if (filters.value.statuses.length > 0) {
      return 'No hay misiones con los estados seleccionados'
    }
    if (filters.value.classes && filters.value.classes.length > 0) {
      return filters.value.classes.length === 1
        ? 'No hay misiones en esta clase'
        : 'No hay misiones en las clases seleccionadas'
    }
    return defaultMessage
  }

  return {
    filters,
    hasActiveFilters,
    filteredMissions,
    resetFilters,
    getEmptyMessage,
  }
}
