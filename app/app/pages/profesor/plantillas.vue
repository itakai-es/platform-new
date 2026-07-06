<template>
  <div class="space-y-6">
    <!-- Cabecera -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-navy-700">
        {{ t('teacher.templates.page_title') }}
      </h1>
      <p class="mt-1 text-text-secondary">{{ t('teacher.templates.page_subtitle') }}</p>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <input
        v-model="search"
        type="text"
        :placeholder="t('teacher.templates.search')"
        class="w-full rounded-2xl border border-border-primary bg-surface px-4 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 lg:max-w-xs"
      />
      <div class="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        <SelectDropdown
          :model-value="fSubject"
          :options="subjectFilterOptions"
          searchable
          @update:model-value="fSubject = String($event)"
        />
        <SelectDropdown
          :model-value="fLevel"
          :options="levelFilterOptions"
          @update:model-value="fLevel = String($event)"
        />
        <SelectDropdown
          :model-value="fLanguage"
          :options="languageFilterOptions"
          @update:model-value="fLanguage = String($event)"
        />
        <SelectDropdown
          :model-value="fProvince"
          :options="provinceFilterOptions"
          searchable
          @update:model-value="fProvince = String($event)"
        />
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      <MissionCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Vacío -->
    <EmptyState
      v-else-if="filtered.length === 0"
      :icon="RectangleStackIcon"
      :title="templates.length === 0 ? t('teacher.templates.empty_title') : t('teacher.templates.no_results_title')"
      :description="
        templates.length === 0
          ? t('teacher.templates.empty_description')
          : t('teacher.templates.no_results_description')
      "
    />

    <!-- Grid de plantillas -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      <div
        v-for="tpl in filtered"
        :key="tpl.id"
        class="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <!-- Portada -->
        <div class="relative h-32 bg-navy-700/5">
          <img
            v-if="tpl.backgroundImage"
            :src="getImageUrl(tpl.backgroundImage) || undefined"
            alt=""
            class="h-full w-full object-cover"
          />
          <span
            v-if="tpl.isOwn"
            class="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700 shadow-sm"
          >
            {{ t('teacher.templates.own') }}
          </span>
        </div>

        <!-- Contenido -->
        <div class="flex flex-1 flex-col p-4">
          <h3 class="font-bold leading-snug text-navy-700">{{ tpl.name }}</h3>
          <p v-if="tpl.narrative" class="mt-1 line-clamp-2 text-sm text-text-secondary">
            {{ tpl.narrative }}
          </p>

          <!-- Chips de clasificación -->
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span
              v-if="tpl.subject"
              class="inline-flex items-center gap-1 rounded-full bg-navy-700/5 px-2 py-0.5 text-xs font-medium text-navy-700"
            >
              <BookOpenIcon class="h-3.5 w-3.5" />{{ tpl.subject }}
            </span>
            <span
              v-if="tpl.educationLevel"
              class="inline-flex items-center gap-1 rounded-full bg-navy-700/5 px-2 py-0.5 text-xs font-medium text-navy-700"
            >
              <AcademicCapIcon class="h-3.5 w-3.5" />{{ tpl.educationLevel }}
            </span>
            <span
              v-if="tpl.language"
              class="inline-flex items-center gap-1 rounded-full bg-navy-700/5 px-2 py-0.5 text-xs font-medium text-navy-700"
            >
              <LanguageIcon class="h-3.5 w-3.5" />{{ tpl.language }}
            </span>
          </div>

          <p class="mt-3 text-xs text-text-secondary">
            {{ tpl.teacherName }} · {{ t('teacher.templates.missions_count', { n: tpl.missionCount }) }}
          </p>

          <Button
            class="mt-3"
            variant="primary"
            size="sm"
            full-width
            :loading="importingId === tpl.id"
            :disabled="importingId !== null"
            @click="importTemplate(tpl)"
          >
            {{ t('teacher.templates.import') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RectangleStackIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LanguageIcon,
} from '@heroicons/vue/24/outline'
import {
  CLASS_SUBJECTS,
  CLASS_EDUCATION_LEVELS,
  CLASS_LANGUAGES,
  SPANISH_PROVINCES,
} from '~/utils/class-metadata'

interface Template {
  id: string
  name: string
  narrative: string | null
  subject: string | null
  language: string | null
  educationLevel: string | null
  province: string | null
  backgroundImage: string | null
  teacherName: string
  missionCount: number
  isOwn: boolean
}

const { t } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()
const { getImageUrl } = useImageUrl()
const classesStore = useClassesStore()

useHead({ title: () => t('teacher.templates.page_title') })

definePageMeta({
  layout: 'teacher',
  middleware: ['auth', 'role'],
})

const templates = ref<Template[]>([])
const loading = ref(true)
const importingId = ref<string | null>(null)

// Filtros (cliente): '' = sin filtro. La etiqueta del campo hace de "todas".
const search = ref('')
const fSubject = ref('')
const fLevel = ref('')
const fLanguage = ref('')
const fProvince = ref('')

const G = 'teacher.classes.detail.settings.general'
const subjectFilterOptions = computed(() => [{ value: '', label: t(`${G}.subject_label`) }, ...CLASS_SUBJECTS])
const levelFilterOptions = computed(() => [{ value: '', label: t(`${G}.level_label`) }, ...CLASS_EDUCATION_LEVELS])
const languageFilterOptions = computed(() => [{ value: '', label: t(`${G}.language_label`) }, ...CLASS_LANGUAGES])
const provinceFilterOptions = computed(() => [{ value: '', label: t(`${G}.province_label`) }, ...SPANISH_PROVINCES])

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

const filtered = computed(() => {
  const q = normalize(search.value.trim())
  return templates.value.filter((tpl) => {
    if (fSubject.value && tpl.subject !== fSubject.value) return false
    if (fLevel.value && tpl.educationLevel !== fLevel.value) return false
    if (fLanguage.value && tpl.language !== fLanguage.value) return false
    if (fProvince.value && tpl.province !== fProvince.value) return false
    if (q) {
      const hay = normalize(`${tpl.name} ${tpl.narrative ?? ''}`)
      if (!hay.includes(q)) return false
    }
    return true
  })
})

async function loadTemplates() {
  loading.value = true
  try {
    const data = await $fetch<{ templates: Template[] }>(`${config.public.apiBase}/teacher/templates`)
    templates.value = data.templates
  } catch {
    toast.error(t('teacher.templates.load_error'))
  } finally {
    loading.value = false
  }
}

async function importTemplate(tpl: Template) {
  if (importingId.value) return
  importingId.value = tpl.id
  try {
    const res = await $fetch<{ class: { id: string; name: string } }>(
      `${config.public.apiBase}/teacher/templates/${tpl.id}/import`,
      { method: 'POST' }
    )
    // Invalida la caché de clases para que la nueva aparezca al volver al listado.
    classesStore.hasLoadedClasses = false
    toast.success(t('teacher.templates.import_success', { name: res.class.name }))
    navigateTo(`/profesor/clases/${res.class.id}`)
  } catch {
    toast.error(t('teacher.templates.import_error'))
  } finally {
    importingId.value = null
  }
}

onMounted(loadTemplates)
</script>
