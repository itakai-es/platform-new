<template>
  <div class="space-y-6">
    <PageHeader
      :title="className ? `Analítica de ${className}` : 'Analítica de clase'"
      subtitle="Detecta enigmas con atasco, revisiones pendientes y puntos donde el alumnado necesita ayuda."
    >
      <template #actions>
        <NuxtLink :to="`/profesor/clases/${classId}`">
          <Button variant="outline">Volver a la clase</Button>
        </NuxtLink>
      </template>
    </PageHeader>

    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 5" :key="i" height="h-24" />
    </div>

    <EmptyState
      v-else-if="!enigmaRows.length"
      :icon="ChartBarIcon"
      title="Sin datos de analítica"
      description="Todavía no hay enigmas publicados o no existen entregas suficientes para calcular atascos."
    />

    <div v-else class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card type="stats">
        <CardHeader title="Atascos por enigma" :icon="ChartBarIcon" title-tag="h2" />

        <div class="space-y-3 p-4">
          <div v-for="row in sortedRows" :key="row.id" class="rounded-2xl bg-white p-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <p class="text-sm font-semibold uppercase tracking-[0.12em] text-navy-700/50">
                  {{ row.missionTitle }}
                </p>
                <h3 class="truncate text-lg font-bold text-navy-700">{{ row.title }}</h3>
                <p class="mt-1 text-sm text-navy-700/70">
                  {{ row.pendingSubmissions }} pendientes de {{ row.totalSubmissions }} entregas
                  registradas
                </p>
              </div>

              <div class="grid grid-cols-3 gap-3 lg:min-w-[360px]">
                <div class="rounded-xl bg-navy-700/5 px-3 py-4 text-center">
                  <p class="text-2xl font-semibold text-navy-700">{{ row.pendingSubmissions }}</p>
                  <p class="mt-1 text-xs text-navy-700/60">Pendientes</p>
                </div>
                <div class="rounded-xl bg-navy-700/5 px-3 py-4 text-center">
                  <p class="text-2xl font-semibold text-navy-700">{{ row.totalSubmissions }}</p>
                  <p class="mt-1 text-xs text-navy-700/60">Entregas</p>
                </div>
                <div class="rounded-xl px-3 py-4 text-center" :class="riskClass(row.riskScore)">
                  <p class="text-2xl font-semibold">{{ row.riskScore }}%</p>
                  <p class="mt-1 text-xs">Riesgo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div class="space-y-6">
        <Card type="ia">
          <CardHeader title="Resumen" :icon="ExclamationTriangleIcon" title-tag="h2" />

          <div class="grid grid-cols-1 gap-4 p-4">
            <div class="rounded-2xl bg-white px-4 py-6 text-center">
              <p class="text-4xl font-semibold text-navy-700">{{ criticalCount }}</p>
              <p class="mt-2 text-sm text-navy-700/70">Enigmas críticos</p>
            </div>
            <div class="rounded-2xl bg-white px-4 py-6 text-center">
              <p class="text-4xl font-semibold text-navy-700">{{ totalPending }}</p>
              <p class="mt-2 text-sm text-navy-700/70">Revisiones pendientes</p>
            </div>
            <div class="rounded-2xl bg-white px-4 py-6 text-center">
              <p class="text-4xl font-semibold text-navy-700">{{ missionCount }}</p>
              <p class="mt-2 text-sm text-navy-700/70">Misiones analizadas</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface EnigmaRow {
  id: string
  title: string
  missionTitle: string
  pendingSubmissions: number
  totalSubmissions: number
  riskScore: number
}

definePageMeta({
  layout: 'teacher',
  middleware: ['auth', 'role'],
})

const route = useRoute()
const teacherStore = useTeacherStore()
const toast = useToast()

const classId = computed(() => route.params.id as string)
const loading = ref(true)

const analytics = computed<{ className: string; enigmaRows: EnigmaRow[] } | undefined>(() =>
  teacherStore.classAnalytics.get(classId.value)
)
const className = computed(() => analytics.value?.className || '')
const enigmaRows = computed<EnigmaRow[]>(() => analytics.value?.enigmaRows || [])

const sortedRows = computed(() =>
  [...enigmaRows.value].sort(
    (a, b) => b.riskScore - a.riskScore || b.pendingSubmissions - a.pendingSubmissions
  )
)
const totalPending = computed(() =>
  enigmaRows.value.reduce((sum, row) => sum + row.pendingSubmissions, 0)
)
const criticalCount = computed(() => enigmaRows.value.filter(row => row.riskScore >= 50).length)
const missionCount = computed(() => new Set(enigmaRows.value.map(row => row.missionTitle)).size)

const riskClass = (riskScore: number) => {
  if (riskScore >= 70) return 'bg-red-100 text-red-600'
  if (riskScore >= 40) return 'bg-yellow/20 text-navy-700'
  return 'bg-green-100 text-green-700'
}

const loadAnalytics = async () => {
  loading.value = true
  try {
    await teacherStore.ensureClassAnalytics(classId.value)
  } catch (error) {
    console.error('Error loading class analytics:', error)
    toast.error('No se pudo cargar la analítica de la clase')
  } finally {
    loading.value = false
  }
}

watch(classId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadAnalytics()
  }
})

onMounted(async () => {
  await loadAnalytics()
})
</script>
