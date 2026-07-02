<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('legal.privacy_policy.meta.title'),
  meta: [{ name: 'description', content: () => t('legal.privacy_policy.meta.description') }],
})

definePageMeta({
  layout: 'landing',
})
</script>

<template>
  <div class="bg-white">
    <!-- Header Section -->
    <section
      class="pt-28 md:pt-32 pb-20 mt-64 md:mt-0"
      style="background: white; margin-top: 300px"
    >
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-h1 md:text-5xl font-bold mb-6 text-navy-700">
            {{ t('legal.privacy_policy.title') }}
          </h1>
          <p class="text-xl text-navy-700">
            {{ t('legal.privacy_policy.last_updated') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto prose prose-lg">
          <!-- 1. Introducción -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.introduction.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.introduction.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.introduction.p2') }}
            </p>
          </div>

          <!-- 2. Información que recopilamos -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.information_collected.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.privacy_policy.sections.information_collected.account_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.information_collected.account_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mb-6">
              <li>{{ t('legal.privacy_policy.sections.information_collected.account_name') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.account_email') }}</li>
              <li>
                {{ t('legal.privacy_policy.sections.information_collected.account_password') }}
              </li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.account_role') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.account_avatar') }}</li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.privacy_policy.sections.information_collected.usage_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.information_collected.usage_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mb-6">
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_missions') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_xp') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_ai') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_chat') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_badges') }}</li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.usage_stats') }}</li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.privacy_policy.sections.information_collected.technical_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.information_collected.technical_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.privacy_policy.sections.information_collected.technical_ip') }}</li>
              <li>
                {{ t('legal.privacy_policy.sections.information_collected.technical_browser') }}
              </li>
              <li>{{ t('legal.privacy_policy.sections.information_collected.technical_os') }}</li>
              <li>
                {{ t('legal.privacy_policy.sections.information_collected.technical_pages') }}
              </li>
              <li>
                {{ t('legal.privacy_policy.sections.information_collected.technical_cookies') }}
              </li>
            </ul>
          </div>

          <!-- 3. Cómo usamos la información -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.how_we_use.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.how_we_use.intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.educational') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.personalization') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.communication') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.improvement') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.security') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.how_we_use.legal') }}</strong>
              </li>
            </ul>
          </div>

          <!-- 4. Compartir información -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.sharing.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.sharing.intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>
                <strong>{{ t('legal.privacy_policy.sections.sharing.teachers') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.sharing.providers') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.sharing.legal_requirements') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.sharing.rights') }}</strong>
              </li>
            </ul>
          </div>

          <!-- 5. Seguridad -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.data_security.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.data_security.intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mt-4">
              <li>{{ t('legal.privacy_policy.sections.data_security.encryption') }}</li>
              <li>{{ t('legal.privacy_policy.sections.data_security.https') }}</li>
              <li>{{ t('legal.privacy_policy.sections.data_security.access') }}</li>
              <li>{{ t('legal.privacy_policy.sections.data_security.audits') }}</li>
              <li>{{ t('legal.privacy_policy.sections.data_security.backup') }}</li>
            </ul>
          </div>

          <!-- 6. Derechos GDPR -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.gdpr_rights.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.gdpr_rights.intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.access') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.rectification') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.erasure') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.portability') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.objection') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.privacy_policy.sections.gdpr_rights.restriction') }}</strong>
              </li>
            </ul>
            <p class="text-text-secondary leading-relaxed mt-4">
              {{ t('legal.privacy_policy.sections.gdpr_rights.contact') }}
            </p>
          </div>

          <!-- 7. Cookies -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.cookies_section.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.cookies_section.text') }}
            </p>
          </div>

          <!-- 8. Retención -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.data_retention.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.data_retention.text') }}
            </p>
          </div>

          <!-- 9. Menores -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.minors.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.minors.text') }}
            </p>
          </div>

          <!-- 10. Cambios -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.policy_changes.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy_policy.sections.policy_changes.text') }}
            </p>
          </div>

          <!-- 11. Contacto -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.privacy_policy.sections.contact.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.privacy_policy.sections.contact.intro') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.privacy_policy.sections.contact.company') }}
              </p>
              <p class="text-text-secondary">
                {{ t('legal.privacy_policy.sections.contact.email_label') }}
                <a href="mailto:privacidad@itakai.com" class="link-underline text-purple"
                  >privacidad@itakai.com</a
                >
              </p>
              <p class="text-text-secondary">
                {{ t('legal.privacy_policy.sections.contact.support_label') }}
                <a href="mailto:soporte@itakai.com" class="link-underline text-purple"
                  >soporte@itakai.com</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Aplicar color navy-700 a todos los textos */
:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6),
:deep(p),
:deep(li),
:deep(span),
:deep(strong),
:deep(div) {
  color: var(--color-navy-700);
}

/* Mantener color de enlaces */
:deep(a) {
  color: var(--color-purple);
}
</style>
