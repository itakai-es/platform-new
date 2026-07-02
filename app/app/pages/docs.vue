<template>
  <div style="margin-top: 300px">
    <UnderDevelopment
      :title="t('common.docs.title')"
      :description="t('common.docs.description')"
      god-avatar="/app/avatars/atenea.svg"
      god-name="Atenea"
      back-route="/"
      :back-button-text="t('common.docs.btn_back')"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'landing',
})

useHead({
  title: () => t('common.docs.meta.title'),
  meta: [
    {
      name: 'description',
      content: () => t('common.docs.meta.description'),
    },
  ],
})
</script>
