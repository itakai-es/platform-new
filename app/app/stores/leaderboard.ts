import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ClassRanking } from '~/types/ranking.types'

// Types
export interface LeaderboardStudent {
  id: string
  name: string
  avatar: string | null
  rank: number
  xp: number
  level: number
  isCurrentUser: boolean
}

export interface CurrentUserStats {
  id: string
  name: string
  avatar: string | null
  rank: number
  xp: number
  level: number
  weeklyXP: number
  monthlyXP: number
}

export type LeaderboardPeriod = 'week' | 'month' | 'all'

export interface FetchLeaderboardParams {
  tab: 'global' | 'class' | 'friends'
  period: LeaderboardPeriod
  classId?: string
}

export const useLeaderboardStore = defineStore('leaderboard', () => {
  // State
  const currentUserStats = ref<CurrentUserStats | null>(null)
  const leaderboard = ref<LeaderboardStudent[]>([])
  const isLoadingCurrentUser = ref(false)
  const isLoadingLeaderboard = ref(false)
  const error = ref<string | null>(null)

  // ---------------------------------------------------------------------------
  // Cachés y flags para los ensureX (siguen el patrón canónico de
  // useTeacherClassDetail/useStudentClassDetail: cada endpoint tiene su propio
  // bandera para que `ensureX()` sepa si saltar la llamada sin tener que mirar
  // si los datos están vacíos).
  // ---------------------------------------------------------------------------

  // Caché del global leaderboard por periodo ('week' | 'month' | 'all').
  const globalLeaderboardByPeriod = ref<Map<LeaderboardPeriod, LeaderboardStudent[]>>(new Map())
  // Caché del class leaderboard por `${classId}:${period}`.
  const classLeaderboardByKey = ref<Map<string, ClassRanking>>(new Map())

  // Banderas explícitas de "ya cargado" — un set vacío tras fetchar no debe
  // disparar refetch en cada visita.
  const hasLoadedCurrentUserStats = ref(false)
  const loadedGlobalLeaderboardPeriods = ref<Set<LeaderboardPeriod>>(new Set())
  const loadedClassLeaderboardKeys = ref<Set<string>>(new Set())

  // Mapa de requests en vuelo para evitar requests paralelos duplicados
  // cuando varias vistas/watchers piden la misma combinación a la vez.
  const pendingLeaderboardRequest = ref<Map<string, Promise<any>>>(new Map())

  function classKey(classId: string, period: LeaderboardPeriod) {
    return `${classId}:${period}`
  }

  // Actions

  /**
   * Fetch current user stats for leaderboard
   * (API legacy: mantiene comportamiento previo de forzar siempre el fetch).
   */
  async function fetchCurrentUserStats() {
    try {
      isLoadingCurrentUser.value = true
      error.value = null

      const config = useRuntimeConfig()
      const response = await $fetch<{ user: CurrentUserStats }>(
        `${config.public.apiBase}/students/leaderboard/me`
      )

      currentUserStats.value = response.user
      hasLoadedCurrentUserStats.value = true
      return response.user
    } catch (err: any) {
      error.value = err.message || 'Error al cargar estadísticas del usuario'
      console.error('Error fetching current user stats:', err)
      throw err
    } finally {
      isLoadingCurrentUser.value = false
    }
  }

  /**
   * Idempotente: salta si las stats del usuario ya están cargadas.
   * `force=true` ignora la bandera y reentra al fetch.
   */
  async function ensureCurrentUserStats(force = false) {
    if (hasLoadedCurrentUserStats.value && !force) return currentUserStats.value
    if (isLoadingCurrentUser.value) {
      const existing = pendingLeaderboardRequest.value.get('currentUserStats')
      if (existing) return existing
      return currentUserStats.value
    }

    const promise = fetchCurrentUserStats()
    pendingLeaderboardRequest.value.set('currentUserStats', promise)
    try {
      return await promise
    } finally {
      pendingLeaderboardRequest.value.delete('currentUserStats')
    }
  }

  /**
   * Fetch leaderboard based on tab, period, and optional classId.
   * (API legacy: mantiene comportamiento previo — siempre fetch, sin caché.)
   */
  async function fetchLeaderboard(params: FetchLeaderboardParams) {
    try {
      isLoadingLeaderboard.value = true
      error.value = null

      const config = useRuntimeConfig()
      const queryParams = new URLSearchParams({ period: params.period })

      let url = ''
      if (params.tab === 'global') {
        url = `${config.public.apiBase}/students/leaderboard/global?${queryParams}`
      } else if (params.tab === 'class') {
        if (!params.classId) {
          throw new Error('classId is required for class leaderboard')
        }
        url = `${config.public.apiBase}/students/leaderboard/class/${params.classId}?${queryParams}`
      } else if (params.tab === 'friends') {
        url = `${config.public.apiBase}/students/leaderboard/friends?${queryParams}`
      }

      const response = await $fetch<{
        leaderboard: LeaderboardStudent[]
        total: number
        period: string
      }>(url)

      leaderboard.value = response.leaderboard || []
      return response.leaderboard
    } catch (err: any) {
      error.value = err.message || 'Error al cargar el ranking'
      console.error('Error fetching leaderboard:', err)
      leaderboard.value = []
      throw err
    } finally {
      isLoadingLeaderboard.value = false
    }
  }

  /**
   * Idempotente: carga (y cachea) el global leaderboard para un periodo dado.
   * Si ya está cargado, no refetcha; si hay un request en vuelo para el mismo
   * periodo, reutiliza la promesa (evita duplicados paralelos).
   */
  async function ensureGlobalLeaderboard(
    period: LeaderboardPeriod = 'all',
    force = false
  ): Promise<LeaderboardStudent[]> {
    const key = `global:${period}`
    if (loadedGlobalLeaderboardPeriods.value.has(period) && !force) {
      return globalLeaderboardByPeriod.value.get(period) || []
    }
    const inFlight = pendingLeaderboardRequest.value.get(key)
    if (inFlight) return inFlight

    const config = useRuntimeConfig()
    const promise = (async () => {
      isLoadingLeaderboard.value = true
      try {
        const response = await $fetch<{
          leaderboard: LeaderboardStudent[]
          total?: number
          period?: string
        }>(`${config.public.apiBase}/students/leaderboard/global`, {
          params: { period },
        })
        const data = response.leaderboard || []
        globalLeaderboardByPeriod.value.set(period, data)
        loadedGlobalLeaderboardPeriods.value.add(period)
        // Mantén `leaderboard` sincronizado con la última lectura para
        // retro-compatibilidad con consumidores legacy.
        leaderboard.value = data
        return data
      } catch (err: any) {
        error.value = err.message || 'Error al cargar el ranking global'
        console.error('Error fetching global leaderboard:', err)
        throw err
      } finally {
        isLoadingLeaderboard.value = false
        pendingLeaderboardRequest.value.delete(key)
      }
    })()
    pendingLeaderboardRequest.value.set(key, promise)
    return promise
  }

  /**
   * Idempotente: carga (y cachea) el ranking de una clase para un periodo dado.
   * Cachea por `${classId}:${period}`; reutiliza requests en vuelo.
   */
  async function ensureClassLeaderboard(
    classId: string,
    period: LeaderboardPeriod = 'all',
    force = false
  ): Promise<ClassRanking | null> {
    if (!classId) return null
    const key = classKey(classId, period)
    if (loadedClassLeaderboardKeys.value.has(key) && !force) {
      return classLeaderboardByKey.value.get(key) || null
    }
    const reqKey = `class:${key}`
    const inFlight = pendingLeaderboardRequest.value.get(reqKey)
    if (inFlight) return inFlight

    const config = useRuntimeConfig()
    const promise = (async () => {
      isLoadingLeaderboard.value = true
      try {
        const response = await $fetch<ClassRanking>(
          `${config.public.apiBase}/students/leaderboard/class/${classId}`,
          { params: { period } }
        )
        classLeaderboardByKey.value.set(key, response)
        loadedClassLeaderboardKeys.value.add(key)
        return response
      } catch (err: any) {
        error.value = err.message || 'Error al cargar el ranking de la clase'
        console.error('Error fetching class leaderboard:', err)
        throw err
      } finally {
        isLoadingLeaderboard.value = false
        pendingLeaderboardRequest.value.delete(reqKey)
      }
    })()
    pendingLeaderboardRequest.value.set(reqKey, promise)
    return promise
  }

  /**
   * Selectores de caché (no disparan fetch). Útiles para leer el último valor
   * cacheado sin re-entrar en una llamada.
   */
  function getGlobalLeaderboard(period: LeaderboardPeriod): LeaderboardStudent[] {
    return globalLeaderboardByPeriod.value.get(period) || []
  }
  function getClassLeaderboard(classId: string, period: LeaderboardPeriod): ClassRanking | null {
    return classLeaderboardByKey.value.get(classKey(classId, period)) || null
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null
  }

  /**
   * Reset store
   */
  function $reset() {
    currentUserStats.value = null
    leaderboard.value = []
    isLoadingCurrentUser.value = false
    isLoadingLeaderboard.value = false
    error.value = null
    globalLeaderboardByPeriod.value = new Map()
    classLeaderboardByKey.value = new Map()
    hasLoadedCurrentUserStats.value = false
    loadedGlobalLeaderboardPeriods.value = new Set()
    loadedClassLeaderboardKeys.value = new Set()
    pendingLeaderboardRequest.value = new Map()
  }

  return {
    // State
    currentUserStats,
    leaderboard,
    isLoadingCurrentUser,
    isLoadingLeaderboard,
    error,

    // Cachés y banderas (expuestos para que las vistas puedan reaccionar)
    globalLeaderboardByPeriod,
    classLeaderboardByKey,
    hasLoadedCurrentUserStats,
    loadedGlobalLeaderboardPeriods,
    loadedClassLeaderboardKeys,
    pendingLeaderboardRequest,

    // Actions (legacy, sin caché)
    fetchCurrentUserStats,
    fetchLeaderboard,

    // Actions idempotentes (patrón ensureX)
    ensureCurrentUserStats,
    ensureGlobalLeaderboard,
    ensureClassLeaderboard,

    // Selectores de caché
    getGlobalLeaderboard,
    getClassLeaderboard,

    clearError,
    $reset,
  }
})
