<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-sm h-[280px]">
    <!-- Image placeholder -->
    <div class="h-[100px]" :style="{ backgroundColor: 'var(--color-skeleton)' }" />
    <!-- Content -->
    <div class="p-4 space-y-3">
      <div class="flex gap-2">
        <Skeleton width="w-16" height="h-5" />
        <Skeleton width="w-20" height="h-5" />
      </div>
      <Skeleton width="w-3/4" height="h-6" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-2/3" height="h-4" />
      <div class="flex justify-between pt-2">
        <Skeleton width="w-24" height="h-5" />
        <Skeleton width="w-16" height="h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
