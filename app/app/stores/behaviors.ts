import { defineStore } from 'pinia'
import type { BehaviorKind, BehaviorSuggestion } from '~/utils/behavior-suggestions'

/**
 * Store de comportamientos por clase, conectado al backend. El catálogo lo
 * mantiene el servidor (BehaviorTemplate) y las aplicaciones modifican XP,
 * monedas y puntos de vida del alumno en una transacción.
 */
export interface Behavior {
  id: string
  classId: string
  kind: BehaviorKind
  name: string
  description: string
  xp?: number
  coins?: number
  lives?: number
  createdAt: string
  updatedAt: string
}

export interface BehaviorApplyResult {
  application: {
    id: string
    behaviorId: string | null
    studentId: string
    kind: BehaviorKind
    name: string
    xpDelta: number
    coinDelta: number
    lifeDelta: number
    createdAt: string
  }
  enrollment: {
    studentId: string
    classId: string
    xp: number
    coins: number
    lives: number
    level: number
  }
}

interface BehaviorInput {
  kind: BehaviorKind
  name: string
  description: string
  xp?: number
  coins?: number
  lives?: number
}

export const useBehaviorsStore = defineStore('behaviors', () => {
  const classBehaviors = ref<Map<string, Behavior[]>>(new Map())
  const loading = ref(false)
  // Banderas explícitas por classId para que `ensureBehaviors()` sepa si
  // saltar la llamada sin tener que mirar si la lista está vacía (una clase
  // sin comportamientos es un estado válido y no debe disparar refetch en
  // cada visita).
  const loadedBehaviorClasses = ref<Set<string>>(new Set())
  const loadingBehaviorClasses = ref<Set<string>>(new Set())

  // Capturado en el setup del store (contexto Nuxt válido), no en acciones async.
  const base = useRuntimeConfig().public.apiBase as string
  function apiBase(): string {
    return base
  }

  function touch() {
    classBehaviors.value = new Map(classBehaviors.value)
  }

  function touchLoaded() {
    loadedBehaviorClasses.value = new Set(loadedBehaviorClasses.value)
  }

  function touchLoading() {
    loadingBehaviorClasses.value = new Set(loadingBehaviorClasses.value)
  }

  function invalidate(classId: string) {
    if (loadedBehaviorClasses.value.has(classId)) {
      loadedBehaviorClasses.value.delete(classId)
      touchLoaded()
    }
  }

  function getBehaviors(classId: string): Behavior[] {
    return classBehaviors.value.get(classId) ?? []
  }

  function exists(classId: string, name: string, excludeId?: string): boolean {
    const norm = name.trim().toLowerCase()
    return (classBehaviors.value.get(classId) ?? []).some(
      b => b.id !== excludeId && b.name.trim().toLowerCase() === norm
    )
  }

  /** Carga los comportamientos de una clase si no se han cargado todavía
   *  (o si `force=true`). Es idempotente: llamadas repetidas no disparan más
   *  de un fetch en vuelo por classId. */
  async function ensureBehaviors(classId: string, force = false): Promise<void> {
    if (loadedBehaviorClasses.value.has(classId) && !force) return
    if (loadingBehaviorClasses.value.has(classId)) return
    loadingBehaviorClasses.value.add(classId)
    touchLoading()
    loading.value = true
    try {
      const data = await $fetch<Behavior[]>(`${apiBase()}/teacher/classes/${classId}/behaviors`)
      classBehaviors.value.set(classId, data)
      touch()
      loadedBehaviorClasses.value.add(classId)
      touchLoaded()
    } finally {
      loadingBehaviorClasses.value.delete(classId)
      touchLoading()
      loading.value = false
    }
  }

  /** Alias retrocompatible: siempre fuerza el refetch para mantener la
   *  semántica original (un `fetch` explícito siempre va al backend). */
  async function fetchBehaviors(classId: string): Promise<void> {
    return ensureBehaviors(classId, true)
  }

  async function add(classId: string, data: BehaviorInput): Promise<Behavior> {
    const behavior = await $fetch<Behavior>(`${apiBase()}/teacher/classes/${classId}/behaviors`, {
      method: 'POST',
      body: data,
    })
    const list = classBehaviors.value.get(classId) ?? []
    classBehaviors.value.set(classId, [...list, behavior])
    touch()
    // Mutación → invalidamos la bandera del classId para forzar un refetch
    // limpio en la próxima llamada a ensureBehaviors.
    invalidate(classId)
    return behavior
  }

  async function update(
    classId: string,
    id: string,
    data: Partial<BehaviorInput>
  ): Promise<Behavior> {
    const behavior = await $fetch<Behavior>(
      `${apiBase()}/teacher/classes/${classId}/behaviors/${id}`,
      { method: 'PUT', body: data }
    )
    const list = classBehaviors.value.get(classId) ?? []
    classBehaviors.value.set(
      classId,
      list.map(b => (b.id === id ? behavior : b))
    )
    touch()
    invalidate(classId)
    return behavior
  }

  async function remove(classId: string, id: string): Promise<void> {
    await $fetch(`${apiBase()}/teacher/classes/${classId}/behaviors/${id}`, {
      method: 'DELETE',
    })
    const list = classBehaviors.value.get(classId) ?? []
    classBehaviors.value.set(
      classId,
      list.filter(b => b.id !== id)
    )
    touch()
    invalidate(classId)
  }

  async function apply(
    classId: string,
    behaviorId: string,
    studentId: string
  ): Promise<BehaviorApplyResult> {
    const result = await $fetch<BehaviorApplyResult>(
      `${apiBase()}/teacher/classes/${classId}/behaviors/${behaviorId}/apply`,
      { method: 'POST', body: { studentId } }
    )
    // Aplicar un comportamiento modifica el estado del alumno (XP/coins/lives).
    // Invalidamos por convención del target para que las vistas que dependan
    // de la bandera puedan refrescar.
    invalidate(classId)
    return result
  }

  async function addFromSuggestion(classId: string, s: BehaviorSuggestion): Promise<Behavior> {
    return add(classId, {
      kind: s.kind,
      name: s.name,
      description: s.description,
      xp: s.xp,
      coins: s.coins,
      lives: s.lives,
    })
  }

  return {
    loading,
    loadedBehaviorClasses,
    getBehaviors,
    exists,
    ensureBehaviors,
    fetchBehaviors,
    add,
    update,
    remove,
    apply,
    addFromSuggestion,
  }
})
