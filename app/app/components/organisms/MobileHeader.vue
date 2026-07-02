<template>
  <header
    class="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-40 flex items-center px-4 gap-3"
  >
    <!-- Hamburger Button -->
    <button
      type="button"
      class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      :aria-label="$t('common.actions.toggle_menu')"
      @click="$emit('toggle-menu')"
    >
      <svg class="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div class="flex-1" />
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  badge?: string
  badgeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ITAKAI',
  badge: undefined,
  badgeClass: '',
})

defineEmits(['toggle-menu'])
</script>
