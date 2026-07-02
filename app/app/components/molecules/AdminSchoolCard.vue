<template>
  <Card type="info" padding="md" hoverable>
    <div class="flex items-start justify-between">
      <!-- School Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <h3 class="text-sm font-semibold text-text-primary truncate">{{ school.name }}</h3>
          <Badge :variant="school.status === 'active' ? 'success' : 'default'" size="sm">
            {{ school.status === 'active' ? 'Activa' : 'Inactiva' }}
          </Badge>
        </div>
        <p v-if="school.city" class="text-xs text-text-secondary mb-3">
          {{ school.city }}<span v-if="school.country">, {{ school.country }}</span>
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <p class="text-lg font-bold text-text-primary">{{ school.activeStudents }}</p>
            <p class="text-xs text-text-secondary">Alumnos</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold text-text-primary">{{ school.activeTeachers }}</p>
            <p class="text-xs text-text-secondary">Profesores</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold text-text-primary">{{ school.totalClasses }}</p>
            <p class="text-xs text-text-secondary">Clases</p>
          </div>
        </div>

        <!-- Activity Rate Bar -->
        <div class="mt-3">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-text-secondary">Actividad</span>
            <span :class="rateColorClass" class="font-semibold">{{ school.activityRate }}%</span>
          </div>
          <div class="w-full h-1.5 bg-border-primary rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="rateBarClass"
              :style="{ width: `${school.activityRate}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div ref="dropdownRef" class="relative ml-2 flex-shrink-0">
        <button
          class="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          @click="showActions = !showActions"
        >
          <EllipsisVerticalIcon class="w-4 h-4 text-text-secondary" />
        </button>

        <Transition name="fade">
          <div
            v-if="showActions"
            class="absolute right-0 top-full mt-1 w-40 bg-surface border border-border-primary rounded-xl shadow-lg z-10 py-1"
          >
            <button
              class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors"
              @click="handleAction('edit')"
            >
              Editar
            </button>
            <button
              class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors"
              @click="handleAction('toggle')"
            >
              {{ school.status === 'active' ? 'Desactivar' : 'Activar' }}
            </button>
            <button
              class="w-full px-3 py-2 text-left text-sm text-red hover:bg-red/10 transition-colors"
              @click="handleAction('delete')"
            >
              Eliminar
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import type { School } from '~/types/admin.types'

interface Props {
  school: School
}

const props = defineProps<Props>()

const emit = defineEmits<{
  action: [action: 'edit' | 'toggle' | 'delete', school: School]
}>()

const showActions = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const rateColorClass = computed(() => {
  if (props.school.activityRate >= 90) return 'text-green-500'
  if (props.school.activityRate >= 70) return 'text-yellow'
  return 'text-red'
})

const rateBarClass = computed(() => {
  if (props.school.activityRate >= 90) return 'bg-green-500'
  if (props.school.activityRate >= 70) return 'bg-yellow'
  return 'bg-red'
})

const handleAction = (action: 'edit' | 'toggle' | 'delete') => {
  showActions.value = false
  emit('action', action, props.school)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showActions.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
