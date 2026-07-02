<template>
  <li
    class="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md"
  >
    <!-- Icono del tipo de artículo (poder = morado + rayo; recompensa = amarillo + regalo). -->
    <Tooltip :text="typeLabel">
      <span
        class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        :class="itemKind === 'power' ? 'bg-purple' : 'bg-yellow'"
      >
        <BoltIcon v-if="itemKind === 'power'" class="h-5 w-5 text-white" />
        <GiftIcon v-else class="h-5 w-5 text-navy-700" />
      </span>
    </Tooltip>

    <div class="min-w-0 flex-1">
      <p class="font-bold text-navy-700 leading-snug truncate">{{ title }}</p>
      <p class="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-text-secondary">
        <!-- Vista del profesor: avatar + nickname del alumno antes del subtítulo.
             Mini-avatar al estilo del átomo Avatar (fondo lila + object-contain),
             con iniciales de respaldo para que siempre se vea quién fue. -->
        <template v-if="name">
          <!-- Si tenemos el id del alumno (vista del profesor), avatar + nombre son
               un enlace a su perfil con Tooltip de la app. -->
          <Tooltip
            v-if="studentId"
            :text="t('teacher.classes.detail.shop.view_student_profile')"
          >
            <NuxtLink
              :to="`/profesor/alumnos/${studentId}`"
              class="group flex min-w-0 items-center gap-1.5 cursor-pointer"
            >
              <span
                class="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-lila-medium text-[9px] font-bold text-text-primary"
              >
                <img v-if="avatar" :src="avatar" :alt="name" class="h-full w-full object-contain p-px" />
                <template v-else>{{ initials }}</template>
              </span>
              <span
                class="truncate font-medium text-navy-700/70 transition-colors group-hover:text-navy-700 group-hover:underline"
              >{{ name }}</span>
            </NuxtLink>
          </Tooltip>
          <span v-else class="flex min-w-0 items-center gap-1.5">
            <span
              class="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-lila-medium text-[9px] font-bold text-text-primary"
            >
              <img v-if="avatar" :src="avatar" :alt="name" class="h-full w-full object-contain p-px" />
              <template v-else>{{ initials }}</template>
            </span>
            <span class="truncate font-medium text-navy-700/70">{{ name }}</span>
          </span>
          <span class="flex-shrink-0" aria-hidden="true">·</span>
        </template>
        <span class="flex-shrink-0">{{ subtitle }}</span>
      </p>
    </div>

    <slot name="badge" />
  </li>
</template>

<script setup lang="ts">
import { GiftIcon, BoltIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  /** Título principal: el nombre del artículo. */
  title: string
  /** Subtítulo (fecha / acción). */
  subtitle: string
  /** Tipo del artículo: determina el icono y el color del círculo. */
  itemKind: 'power' | 'reward'
  /** Vista del profesor: nombre del alumno (se muestra bajo el título). */
  name?: string
  /** Vista del profesor: avatar del alumno (pequeño, junto al nombre). */
  avatar?: string | null
  /** Vista del profesor: user id del alumno → enlace a su perfil. */
  studentId?: string
}>()

const { t } = useI18n()
const typeLabel = computed(() =>
  props.itemKind === 'power'
    ? t('student.classes.detail.shop.power')
    : t('student.classes.detail.shop.reward')
)
// Iniciales de respaldo cuando el alumno aún no tiene avatar.
const initials = computed(() => (props.name ? props.name.slice(0, 2).toUpperCase() : '?'))
</script>
