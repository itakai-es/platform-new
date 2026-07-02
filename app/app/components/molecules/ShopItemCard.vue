<template>
  <div
    class="flex flex-col rounded-2xl p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    :class="[
      faded ? 'opacity-60' : '',
      muted ? 'bg-gray-50' : 'bg-white',
      clickable ? 'cursor-pointer' : 'cursor-default',
    ]"
    @click="$emit('click')"
  >
    <!-- Cabecera: icono (con tooltip de tipo) + título + chip opcional -->
    <div class="flex items-center gap-3">
      <Tooltip :text="typeLabel">
        <span
          class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
          :class="muted ? 'bg-gray-200' : isPower ? 'bg-purple' : 'bg-yellow'"
        >
          <BoltIcon
            v-if="isPower"
            class="h-5 w-5"
            :class="muted ? 'text-gray-400' : 'text-white'"
          />
          <GiftIcon v-else class="h-5 w-5" :class="muted ? 'text-gray-400' : 'text-navy-700'" />
        </span>
      </Tooltip>
      <h3
        class="min-w-0 flex-1 font-bold leading-snug"
        :class="muted ? 'text-gray-400' : 'text-navy-700'"
      >
        {{ item.name }}
      </h3>
      <slot name="chip" />
    </div>

    <p class="mt-3 flex-1 text-sm" :class="muted ? 'text-gray-400' : 'text-text-secondary'">
      {{ item.description }}
    </p>

    <div v-if="item.lifeRestore > 0" class="mt-3 inline-flex items-center gap-1 text-xs font-semibold" :class="muted ? 'text-gray-400' : 'text-navy-700'">
      <LifeIcon class="h-3.5 w-3.5" :mono="muted" />
      +{{ item.lifeRestore }}
      <span class="text-text-secondary font-normal">{{ t('common.resources.lives') }}</span>
    </div>

    <div v-if="$slots.footer" class="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GiftIcon, BoltIcon } from '@heroicons/vue/24/solid'
import type { ShopItem } from '~/stores/shop'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    item: ShopItem
    /** Texto del tooltip del icono (tipo del artículo, resuelto por el padre). */
    typeLabel: string
    /** Atenúa icono/título (p. ej. el alumno no puede permitírselo). */
    muted?: boolean
    /** Baja la opacidad de toda la tarjeta (p. ej. artículo oculto del profesor). */
    faded?: boolean
    clickable?: boolean
  }>(),
  { muted: false, faded: false, clickable: true }
)

defineEmits<{ click: [] }>()

const isPower = computed(() => props.item.kind === 'power')
</script>
