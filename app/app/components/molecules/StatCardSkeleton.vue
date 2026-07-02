<template>
  <Card :type="type">
    <div class="space-y-2">
      <!-- Valor grande (número) -->
      <Skeleton width="w-20" height="h-12" />
      <!-- Label -->
      <Skeleton width="w-28" height="h-5" />
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  type?: 'ia' | 'stats' | 'pending' | 'clases' | 'info'
}

withDefaults(defineProps<Props>(), {
  type: 'stats',
})
</script>
