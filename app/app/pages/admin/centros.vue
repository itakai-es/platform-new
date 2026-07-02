<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1>{{ t('admin.schools.title') }}</h1>
        <p class="text-text-secondary mt-1">{{ t('admin.schools.subtitle') }}</p>
      </div>
      <Button variant="primary" size="sm" @click="openCreateModal">
        {{ t('admin.schools.actions.create') }}
      </Button>
    </div>

    <AdminFilterBar
      :search="filters.search || ''"
      :search-placeholder="t('admin.schools.filters.search_placeholder')"
      :filters="filterConfig"
      :total-results="schools.length"
      :has-active-filters="hasActiveFilters"
      @update:search="handleSearchChange"
      @filter-change="handleFilterChange"
      @reset="resetFilters"
    />

    <div v-if="isLoadingSchools" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card v-for="i in 4" :key="i" type="info" padding="md">
        <div class="space-y-3">
          <Skeleton width="w-48" height="h-5" />
          <Skeleton width="w-32" height="h-3" />
          <div class="grid grid-cols-3 gap-3">
            <Skeleton height="h-12" /><Skeleton height="h-12" /><Skeleton height="h-12" />
          </div>
        </div>
      </Card>
    </div>

    <CardGrid v-else-if="schools.length > 0" cols="2">
      <AdminSchoolCard
        v-for="school in schools"
        :key="school.id"
        :school="school"
        @action="handleSchoolAction"
      />
    </CardGrid>

    <Card v-else type="info" padding="lg">
      <div class="text-center py-8">
        <BuildingOffice2Icon class="w-12 h-12 text-text-secondary mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-text-primary mb-1">
          {{ t('admin.schools.empty.title') }}
        </h3>
        <p class="text-sm text-text-secondary">{{ t('admin.schools.empty.description') }}</p>
      </div>
    </Card>

    <Modal
      v-model="showFormModal"
      :title="
        editingSchool ? t('admin.schools.form.edit_title') : t('admin.schools.form.create_title')
      "
      size="md"
    >
      <template #body>
        <div class="space-y-4">
          <FormField
            v-model="formData.name"
            :label="t('admin.schools.form.name')"
            :placeholder="t('admin.schools.form.name_placeholder')"
            :required="true"
          />
          <FormField
            v-model="formData.city"
            :label="t('admin.schools.form.city')"
            :placeholder="t('admin.schools.form.city_placeholder')"
          />
          <FormField
            v-model="formData.country"
            :label="t('admin.schools.form.country')"
            :placeholder="t('admin.schools.form.country_placeholder')"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="showFormModal = false">{{
            t('admin.schools.form.cancel')
          }}</Button>
          <Button
            variant="primary"
            size="sm"
            :loading="isPerformingSchoolAction"
            @click="saveSchool"
            >{{ t('admin.schools.form.save') }}</Button
          >
        </div>
      </template>
    </Modal>

    <ConfirmModal
      v-model="showDeleteModal"
      :title="t('admin.schools.actions.delete_title')"
      :message="t('admin.schools.actions.delete_message', { name: selectedSchool?.name })"
      :confirm-text="t('admin.schools.actions.delete_confirm')"
      variant="danger"
      :loading="isPerformingSchoolAction"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import type { School, SchoolFilters } from '~/types/admin.types'

const { t } = useI18n()
useHead({
  title: () => t('admin.schools.meta.title'),
  meta: [{ name: 'description', content: () => t('admin.schools.meta.description') }],
})
definePageMeta({ layout: 'admin', middleware: ['auth', 'onboarding', 'role'], role: 'admin' })

const adminStore = useAdminStore()
const { schools, isLoadingSchools, isPerformingSchoolAction } = storeToRefs(adminStore)

const filters = ref<SchoolFilters>({ search: '', status: 'all' })
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingSchool = ref<School | null>(null)
const selectedSchool = ref<School | null>(null)
const formData = ref({ name: '', city: '', country: '' })
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const filterConfig = computed(() => [
  {
    key: 'status',
    value: filters.value.status || 'all',
    options: [
      { value: 'all', label: t('admin.schools.filters.all_statuses') },
      { value: 'active', label: t('admin.schools.filters.active') },
      { value: 'inactive', label: t('admin.schools.filters.inactive') },
    ],
  },
])

const hasActiveFilters = computed<boolean>(
  () =>
    Boolean(filters.value.status && filters.value.status !== 'all') ||
    Boolean(filters.value.search && filters.value.search.length > 0)
)
const fetchSchools = () => adminStore.fetchSchools(filters.value)
const ensureSchools = () => adminStore.ensureSchools(filters.value)

const handleSearchChange = (value: string) => {
  filters.value.search = value
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchSchools, 300)
}
const handleFilterChange = (key: string, value: string | number) => {
  ;(filters.value as Record<string, unknown>)[key] = value
  fetchSchools()
}
const resetFilters = () => {
  filters.value = { search: '', status: 'all' }
  fetchSchools()
}

const openCreateModal = () => {
  editingSchool.value = null
  formData.value = { name: '', city: '', country: '' }
  showFormModal.value = true
}

const handleSchoolAction = (action: 'edit' | 'toggle' | 'delete', school: School) => {
  selectedSchool.value = school
  if (action === 'edit') {
    editingSchool.value = school
    formData.value = { name: school.name, city: school.city || '', country: school.country || '' }
    showFormModal.value = true
  } else if (action === 'toggle') {
    adminStore.toggleSchoolStatus(school.id)
  } else if (action === 'delete') {
    showDeleteModal.value = true
  }
}

const saveSchool = async () => {
  try {
    if (editingSchool.value) await adminStore.updateSchool(editingSchool.value.id, formData.value)
    else await adminStore.createSchool(formData.value)
    showFormModal.value = false
  } catch {
    /* handled in store */
  }
}

const confirmDelete = async () => {
  if (!selectedSchool.value) return
  try {
    await adminStore.deleteSchool(selectedSchool.value.id)
    showDeleteModal.value = false
  } catch {
    /* handled in store */
  }
}

onMounted(ensureSchools)
</script>
