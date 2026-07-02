<template>
  <!-- Skeleton de fila de historial: mismo contenedor que ShopHistoryRow
       (li + icono h-9 + título/subtítulo + badge). -->
  <li class="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
    <Skeleton width="w-9" height="h-9" custom-class="rounded-full flex-shrink-0" />
    <div class="min-w-0 flex-1 space-y-1.5">
      <Skeleton width="w-1/2" height="h-4" />
      <Skeleton width="w-1/3" height="h-3" />
    </div>
    <Skeleton width="w-12" height="h-5" custom-class="rounded-full flex-shrink-0" />
  </li>
</template>

<script setup lang="ts"></script>
