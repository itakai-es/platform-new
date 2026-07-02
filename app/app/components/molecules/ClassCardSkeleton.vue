<template>
  <div
    class="rounded-2xl overflow-hidden min-h-[200px] shadow-lg flex flex-col md:flex-row bg-white"
  >
    <!-- Left content area -->
    <div class="flex-1 flex flex-col justify-between p-4 order-2 md:order-1">
      <!-- Title with icon -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <Skeleton width="w-8" height="h-8" custom-class="rounded-lg" />
          <Skeleton width="w-48" height="h-6" />
        </div>

        <!-- Schedule -->
        <div class="flex items-center gap-1 mb-3">
          <Skeleton width="w-4" height="h-4" />
          <Skeleton width="w-32" height="h-4" />
        </div>

        <!-- Description -->
        <Skeleton width="w-full" height="h-4" custom-class="mb-1" />
        <Skeleton width="w-3/4" height="h-4" custom-class="mb-3" />

        <!-- Stats -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton width="w-20" height="h-4" />
          </div>
          <div class="flex items-center gap-1">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton width="w-16" height="h-4" />
          </div>
        </div>
      </div>

      <!-- Button -->
      <div class="hidden md:block mt-4">
        <Skeleton width="w-24" height="h-8" custom-class="rounded-full" />
      </div>
    </div>

    <!-- Right image area -->
    <div
      class="relative w-full h-[140px] md:h-auto md:w-[45%] flex-shrink-0 order-1 md:order-2"
      :style="{ backgroundColor: 'var(--color-skeleton)' }"
    />
  </div>
</template>

<script setup lang="ts"></script>
