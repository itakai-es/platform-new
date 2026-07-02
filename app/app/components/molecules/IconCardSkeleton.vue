<template>
  <!-- Skeleton de carga para las cards verticales con icono circular.
       Reproduce el alto y la forma de ShopItemCard y BehaviorCardItem
       (rounded-2xl + p-5 + círculo h-11 + título + descripción + pie). -->
  <div class="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
    <div class="flex items-center gap-3">
      <Skeleton width="w-11" height="h-11" custom-class="rounded-full flex-shrink-0" />
      <Skeleton width="w-1/2" height="h-5" />
    </div>
    <div class="mt-3 space-y-2">
      <Skeleton width="w-full" height="h-3" />
      <Skeleton width="w-2/3" height="h-3" />
    </div>
    <div class="mt-4 flex items-center gap-3">
      <Skeleton width="w-16" height="h-5" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
