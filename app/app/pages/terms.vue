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
            {{ t('legal.terms.title') }}
          </h1>
          <p class="text-xl text-navy-700">
            {{ t('legal.terms.last_updated') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto prose prose-lg">
          <!-- 1. Aceptación -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.acceptance.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.acceptance.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.acceptance.p2') }}
            </p>
          </div>

          <!-- 2. Descripción del Servicio -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.service_description.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.service_description.intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.terms.sections.service_description.features.missions') }}</li>
              <li>{{ t('legal.terms.sections.service_description.features.ai_assistants') }}</li>
              <li>{{ t('legal.terms.sections.service_description.features.progress') }}</li>
              <li>{{ t('legal.terms.sections.service_description.features.management') }}</li>
              <li>{{ t('legal.terms.sections.service_description.features.chat') }}</li>
            </ul>
            <p class="text-text-secondary leading-relaxed mt-4">
              {{ t('legal.terms.sections.service_description.disclaimer') }}
            </p>
          </div>

          <!-- 3. Registro y Cuentas -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.accounts.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.accounts.eligibility_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.accounts.eligibility_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.accounts.account_types_title') }}
            </h3>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mb-6">
              <li>
                <strong>{{ t('legal.terms.sections.accounts.account_student') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.terms.sections.accounts.account_teacher') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.terms.sections.accounts.account_admin') }}</strong>
              </li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.accounts.security_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.accounts.security_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.terms.sections.accounts.security_password') }}</li>
              <li>{{ t('legal.terms.sections.accounts.security_activity') }}</li>
              <li>{{ t('legal.terms.sections.accounts.security_notify') }}</li>
              <li>{{ t('legal.terms.sections.accounts.security_info') }}</li>
            </ul>
          </div>

          <!-- 4. Uso Aceptable -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.acceptable_use.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.acceptable_use.permitted_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.acceptable_use.permitted_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mb-6">
              <li>{{ t('legal.terms.sections.acceptable_use.permitted_educational') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.permitted_respect') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.permitted_content') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.permitted_laws') }}</li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.acceptable_use.prohibited_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.acceptable_use.prohibited_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_hacking') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_offensive') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_harassment') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_cheating') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_sharing') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_bots') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_ip') }}</li>
              <li>{{ t('legal.terms.sections.acceptable_use.prohibited_data') }}</li>
            </ul>
          </div>

          <!-- 5. Propiedad Intelectual -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.intellectual_property.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.intellectual_property.content_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.intellectual_property.content_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.intellectual_property.license_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.intellectual_property.license_text') }}
            </p>
          </div>

          <!-- 6. Contenido del Usuario -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.user_content.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.user_content.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.user_content.p2') }}
            </p>
          </div>

          <!-- 7. Limitación de Responsabilidad -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.liability.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.liability.availability_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.liability.availability_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.liability.educational_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.liability.educational_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.liability.warranty_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.liability.warranty_text') }}
            </p>
          </div>

          <!-- 8. Modificaciones -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.modifications.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.modifications.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.modifications.p2') }}
            </p>
          </div>

          <!-- 9. Terminación -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.termination.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.termination.by_user_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.termination.by_user_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.termination.by_itakai_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.termination.by_itakai_intro') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>{{ t('legal.terms.sections.termination.by_itakai_violation') }}</li>
              <li>{{ t('legal.terms.sections.termination.by_itakai_fraud') }}</li>
              <li>{{ t('legal.terms.sections.termination.by_itakai_inactivity') }}</li>
              <li>{{ t('legal.terms.sections.termination.by_itakai_legal') }}</li>
            </ul>
          </div>

          <!-- 10. Ley Aplicable -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.jurisdiction.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.jurisdiction.text') }}
            </p>
          </div>

          <!-- 11. Disposiciones Generales -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.general.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.general.complete_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.general.complete_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.general.severability_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.general.severability_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.terms.sections.general.waiver_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.terms.sections.general.waiver_text') }}
            </p>
          </div>

          <!-- 12. Contacto -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.terms.sections.contact.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.terms.sections.contact.intro') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.terms.sections.contact.company') }}
              </p>
              <p class="text-text-secondary">
                {{ t('legal.terms.sections.contact.email_label') }}
                <a href="mailto:legal@itakai.com" class="link-underline text-purple"
                  >legal@itakai.com</a
                >
              </p>
              <p class="text-text-secondary">
                {{ t('legal.terms.sections.contact.support_label') }}
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

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('legal.terms.meta.title'),
  meta: [{ name: 'description', content: () => t('legal.terms.meta.description') }],
})

definePageMeta({
  layout: 'landing',
})
</script>

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
