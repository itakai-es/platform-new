<template>
  <Card type="ia">
    <!-- Header skeleton (matches CardHeader structure) -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <Skeleton width="w-6" height="h-6" />
        <Skeleton width="w-24" height="h-6" />
      </div>
      <!-- Avatar circular -->
      <Skeleton width="w-12" height="h-12" circle />
    </div>

    <!-- Message + Actions box (matches real component structure) -->
    <CardItem layout="column" padding="md">
      <!-- Message text -->
      <div class="space-y-2 mb-4">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-4/5" height="h-4" />
      </div>
      <!-- Action buttons -->
      <div class="space-y-3 w-full">
        <Skeleton width="w-full" height="h-9" custom-class="rounded-lg" />
        <Skeleton width="w-full" height="h-9" custom-class="rounded-lg" />
        <Skeleton width="w-full" height="h-9" custom-class="rounded-lg" />
      </div>
    </CardItem>
  </Card>
</template>

<script setup lang="ts"></script>
