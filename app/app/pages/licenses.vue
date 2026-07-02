<template>
  <div style="margin-top: 300px">
    <UnderDevelopment
      :title="t('legal.licenses.title')"
      :description="t('legal.licenses.description')"
      god-avatar="/app/avatars/polifemo.svg"
      god-name="Polifemo"
      back-route="/"
      :back-button-text="t('legal.licenses.btn_back')"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'landing',
})

useHead({
  title: () => t('legal.licenses.meta.title'),
  meta: [
    {
      name: 'description',
      content: () => t('legal.licenses.meta.description'),
    },
  ],
})
</script>
