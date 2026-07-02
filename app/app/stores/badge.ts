import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Badge, CreateBadgeData, UpdateBadgeData } from '~/types/badge.types'

export const useBadgeStore = defineStore('badge', () => {
  // State
  const badges = ref<Badge[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Cache de detalles individuales y banderas de "ya cargado".
  // Siguiendo el patrón de useTeacherClassDetail / useStudentClassDetail:
  // - hasLoadedBadges: indica que el listado ya se ha traído al menos una vez,
  //   para que ensureBadges() pueda saltar el fetch si no se fuerza.
  // - loadedBadgeDetails: Set con los IDs de los badges cuyo detalle ya se ha
  //   cargado individualmente. Se almacena el badge en `badges` para reusarlo.
  // - isLoadingBadges / isLoadingBadgeDetail: locks para evitar fetches duplicados
  //   en vuelo cuando varias vistas llaman ensure*() en paralelo.
  const hasLoadedBadges = ref(false)
  const loadedBadgeDetails = ref<Set<string>>(new Set())
  const isLoadingBadges = ref(false)
  const isLoadingBadgeDetail = ref(false)

  // Actions
  /**
   * Obtiene todas las insignias del profesor (fetch directo, sin cache).
   * Se mantiene por compatibilidad con código existente que ya lo invoca.
   * Para uso idempotente con cache, preferir `ensureBadges()`.
   */
  async function fetchBadges() {
    try {
      isLoading.value = true
      isLoadingBadges.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch<{ badges: Badge[]; total: number }>(
        `${config.public.apiBase}/teacher/badges`
      )
      badges.value = response.badges
      hasLoadedBadges.value = true
      return response
    } catch (err) {
      console.error('Error fetching badges:', err)
      error.value = 'Error al cargar las insignias'
      throw err
    } finally {
      isLoading.value = false
      isLoadingBadges.value = false
    }
  }

  /**
   * Obtiene una insignia específica por ID (fetch directo, sin cache).
   * Se mantiene por compatibilidad. Para uso idempotente con cache,
   * preferir `ensureBadgeById()`.
   */
  async function fetchBadgeById(badgeId: string) {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<{ badge: Badge }>(
        `${config.public.apiBase}/teacher/badges/${badgeId}`
      )
      return response.badge
    } catch (err) {
      console.error('Error fetching badge:', err)
      throw err
    }
  }

  /**
   * Garantiza que el listado de insignias esté cargado.
   * - Si ya se cargó y `force` es false, retorna sin hacer fetch.
   * - Si hay un fetch en curso, retorna sin disparar otro.
   * - `force=true` ignora la bandera y refetchea.
   */
  async function ensureBadges(force = false) {
    if (hasLoadedBadges.value && !force) return
    if (isLoadingBadges.value) return
    await fetchBadges()
  }

  /**
   * Garantiza que una insignia esté cargada por ID.
   * - Si el badge ya está en `badges` (cargado previamente) y `force` es false,
   *   retorna la versión cacheada.
   * - `force=true` ignora la cache y refetchea.
   * - Tras fetchear, sincroniza la entrada en `badges` para que otras vistas
   *   que iteren el listado vean los datos frescos.
   */
  async function ensureBadgeById(badgeId: string, force = false): Promise<Badge | null> {
    if (!force && loadedBadgeDetails.value.has(badgeId)) {
      const cached = badges.value.find(b => b.id === badgeId)
      if (cached) return cached
    }
    if (isLoadingBadgeDetail.value) {
      const cached = badges.value.find(b => b.id === badgeId)
      if (cached) return cached
    }
    try {
      isLoadingBadgeDetail.value = true
      const badge = await fetchBadgeById(badgeId)
      // Mantener `badges` sincronizado con el detalle cargado para que
      // consumidores que leen del array vean siempre la versión más reciente.
      const index = badges.value.findIndex(b => b.id === badgeId)
      if (index !== -1) {
        badges.value[index] = badge
      } else {
        badges.value.push(badge)
      }
      loadedBadgeDetails.value.add(badgeId)
      return badge
    } catch (err) {
      console.error('Error ensuring badge by id:', err)
      return null
    } finally {
      isLoadingBadgeDetail.value = false
    }
  }

  /**
   * Invalida toda la cache del store (listado y detalles). Útil tras
   * create/update/delete cuando se quiere garantizar que la próxima
   * llamada a ensure*() vaya a la red.
   */
  function invalidate() {
    hasLoadedBadges.value = false
    loadedBadgeDetails.value = new Set()
  }

  /**
   * Crea una nueva insignia
   */
  async function createBadge(data: CreateBadgeData) {
    try {
      isLoading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch<{ badge: Badge; message: string }>(
        `${config.public.apiBase}/teacher/badges`,
        {
          method: 'POST',
          body: data,
        }
      )
      // Agregar la nueva insignia al array local
      badges.value.push(response.badge)
      // El listado local sigue siendo válido (incluye el nuevo badge);
      // mantenemos hasLoadedBadges en true para evitar refetch innecesario.
      return response
    } catch (err) {
      console.error('Error creating badge:', err)
      error.value = 'Error al crear la insignia'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Actualiza una insignia existente
   */
  async function updateBadge(badgeId: string, data: UpdateBadgeData) {
    try {
      isLoading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch<{ badge: Badge; message: string }>(
        `${config.public.apiBase}/teacher/badges/${badgeId}`,
        {
          method: 'PUT',
          body: data,
        }
      )
      // Actualizar la insignia en el array local
      const index = badges.value.findIndex(b => b.id === badgeId)
      if (index !== -1) {
        badges.value[index] = response.badge
      }
      // El detalle individual queda actualizado en memoria; lo marcamos como cargado.
      loadedBadgeDetails.value.add(badgeId)
      return response
    } catch (err) {
      console.error('Error updating badge:', err)
      error.value = 'Error al actualizar la insignia'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Elimina una insignia
   */
  async function deleteBadge(badgeId: string) {
    try {
      isLoading.value = true
      error.value = null
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBase}/teacher/badges/${badgeId}`, {
        method: 'DELETE',
      })
      // Remover la insignia del array local
      badges.value = badges.value.filter(b => b.id !== badgeId)
      loadedBadgeDetails.value.delete(badgeId)
    } catch (err) {
      console.error('Error deleting badge:', err)
      error.value = 'Error al eliminar la insignia'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Limpia el estado del store
   */
  function $reset() {
    badges.value = []
    isLoading.value = false
    error.value = null
    hasLoadedBadges.value = false
    loadedBadgeDetails.value = new Set()
    isLoadingBadges.value = false
    isLoadingBadgeDetail.value = false
  }

  return {
    // State
    badges,
    isLoading,
    error,
    hasLoadedBadges,
    loadedBadgeDetails,
    isLoadingBadges,
    isLoadingBadgeDetail,
    // Actions
    fetchBadges,
    fetchBadgeById,
    ensureBadges,
    ensureBadgeById,
    invalidate,
    createBadge,
    updateBadge,
    deleteBadge,
    $reset,
  }
})
