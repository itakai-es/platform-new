<template>
  <ClassListTemplate
    :title="t('student.classes.page_title')"
    :subtitle="t('student.classes.page_subtitle')"
    :classes="classes"
    :loading="isLoadingClasses"
    :empty-title="t('student.classes.empty.title')"
    :empty-description="t('student.classes.empty.description')"
    show-coins
    @class-click="navigateToClass"
  >
    <template #header-action>
      <Button variant="primary" @click="showJoinModal = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        {{ t('student.classes.join_class_button') }}
      </Button>
    </template>

    <JoinClassModal v-model="showJoinModal" @success="handleJoinSuccess" />
  </ClassListTemplate>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

useHead({
  title: computed(() => t('student.classes.meta.title')),
  meta: [{ name: 'description', content: computed(() => t('student.classes.meta.description')) }],
})

definePageMeta({
  layout: 'student',
  middleware: ['auth', 'role'],
})

const classesStore = useClassesStore()
const { classes, isLoadingClasses } = storeToRefs(classesStore)
const router = useRouter()

const route = useRoute()
const showJoinModal = ref(false)

const navigateToClass = (classId: string) => {
  router.push(`/alumno/clases/${classId}`)
}

const handleJoinSuccess = () => {
  classesStore.ensureStudentClasses(true)
}

onMounted(async () => {
  await classesStore.ensureStudentClasses()
  // Open join modal if redirected from sidebar
  if (route.query.join === 'true') {
    showJoinModal.value = true
    router.replace({ query: {} })
  }
})
</script>
