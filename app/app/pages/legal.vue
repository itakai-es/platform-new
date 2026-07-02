<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('legal.legal_notice.meta.title'),
  meta: [{ name: 'description', content: () => t('legal.legal_notice.meta.description') }],
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
            {{ t('legal.legal_notice.title') }}
          </h1>
          <p class="text-xl text-navy-700">
            {{ t('legal.legal_notice.last_updated') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto prose prose-lg">
          <!-- 1. Datos Identificativos -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.identification.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.identification.intro') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6">
              <ul class="space-y-2 text-text-secondary">
                <li>
                  <strong>{{
                    t('legal.legal_notice.sections.identification.company_name')
                  }}</strong>
                </li>
                <li>
                  <strong>{{ t('legal.legal_notice.sections.identification.domain') }}</strong>
                </li>
                <li>
                  <strong>{{ t('legal.legal_notice.sections.identification.email_legal') }}</strong>
                  <a href="mailto:legal@itakai.com" class="link-underline text-purple"
                    >legal@itakai.com</a
                  >
                </li>
                <li>
                  <strong>{{
                    t('legal.legal_notice.sections.identification.email_support')
                  }}</strong>
                  <a href="mailto:soporte@itakai.com" class="link-underline text-purple"
                    >soporte@itakai.com</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- 2. Objeto -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.purpose.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.purpose.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed mt-4">
              {{ t('legal.legal_notice.sections.purpose.p2') }}
            </p>
          </div>

          <!-- 3. Condiciones de Uso -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.conditions.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.conditions.access_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.conditions.access_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.conditions.correct_use_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.conditions.correct_use_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.conditions.prohibitions_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.conditions.prohibitions_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.legal_notice.sections.conditions.prohibitions_damage') }}</li>
              <li>{{ t('legal.legal_notice.sections.conditions.prohibitions_impede') }}</li>
              <li>{{ t('legal.legal_notice.sections.conditions.prohibitions_impersonate') }}</li>
              <li>
                {{ t('legal.legal_notice.sections.conditions.prohibitions_illegal_content') }}
              </li>
              <li>{{ t('legal.legal_notice.sections.conditions.prohibitions_malware') }}</li>
              <li>
                {{ t('legal.legal_notice.sections.conditions.prohibitions_unauthorized_access') }}
              </li>
            </ul>
          </div>

          <!-- 4. Propiedad Intelectual -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.intellectual_property.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.intellectual_property.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.intellectual_property.p2') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.intellectual_property.p3') }}
            </p>
          </div>

          <!-- 5. Enlaces a Terceros -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.third_party_links.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.third_party_links.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.third_party_links.p2') }}
            </p>
          </div>

          <!-- 6. Exclusión de Responsabilidad -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.liability_exclusion.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.liability_exclusion.availability_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.liability_exclusion.availability_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.liability_exclusion.content_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.liability_exclusion.content_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.liability_exclusion.security_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.liability_exclusion.security_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.legal_notice.sections.liability_exclusion.user_content_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.liability_exclusion.user_content_text') }}
            </p>
          </div>

          <!-- 7. Modificaciones -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.modifications.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.modifications.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed mt-4">
              {{ t('legal.legal_notice.sections.modifications.p2') }}
            </p>
          </div>

          <!-- 8. Protección de Datos -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.data_protection.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.data_protection.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.data_protection.p2') }}
            </p>
          </div>

          <!-- 9. Cookies -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.cookies_section.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.cookies_section.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.cookies_section.p2') }}
            </p>
          </div>

          <!-- 10. Legislación Aplicable -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.jurisdiction.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.jurisdiction.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.jurisdiction.p2') }}
            </p>
          </div>

          <!-- 11. Resolución de Litigios -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.dispute_resolution.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.dispute_resolution.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.legal_notice.sections.dispute_resolution.p2') }}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener"
                class="link-underline text-purple"
                >https://ec.europa.eu/consumers/odr</a
              >
            </p>
          </div>

          <!-- 12. Contacto -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.legal_notice.sections.contact.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.legal_notice.sections.contact.intro') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.legal_notice.sections.contact.company') }}
              </p>
              <p class="text-text-secondary">
                {{ t('legal.legal_notice.sections.contact.email_legal') }}
                <a href="mailto:legal@itakai.com" class="link-underline text-purple"
                  >legal@itakai.com</a
                >
              </p>
              <p class="text-text-secondary">
                {{ t('legal.legal_notice.sections.contact.email_support') }}
                <a href="mailto:soporte@itakai.com" class="link-underline text-purple"
                  >soporte@itakai.com</a
                >
              </p>
              <p class="text-text-secondary">
                {{ t('legal.legal_notice.sections.contact.email_privacy') }}
                <a href="mailto:privacidad@itakai.com" class="link-underline text-purple"
                  >privacidad@itakai.com</a
                >
              </p>
            </div>
          </div>

          <!-- Aceptación -->
          <div class="mb-12">
            <div class="bg-mint/10 border border-mint rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.legal_notice.sections.acceptance.title') }}
              </p>
              <p class="text-text-secondary leading-relaxed">
                {{ t('legal.legal_notice.sections.acceptance.text') }}
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
