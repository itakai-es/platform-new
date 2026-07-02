<template>
  <div class="bg-white">
    <!-- Header Section -->
    <section class="pt-28 md:pt-32 pb-20 mt-20 md:mt-32 lg:mt-40" style="background: white">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-h1 md:text-5xl font-bold mb-6 text-navy-700">
            {{ t('legal.cookies.title') }}
          </h1>
          <p class="text-xl text-navy-700">
            {{ t('legal.cookies.last_updated') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto prose prose-lg">
          <!-- 1. ¿Qué son las Cookies? -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.what_are.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.what_are.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.what_are.p2') }}
            </p>
          </div>

          <!-- 2. Tipos de Cookies -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.types.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.cookies.sections.types.essential_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.types.essential_text') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6 mb-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.cookies.sections.types.essential_examples_title') }}
              </p>
              <ul class="list-disc pl-6 text-text-secondary space-y-2">
                <li>{{ t('legal.cookies.sections.types.essential_session') }}</li>
                <li>{{ t('legal.cookies.sections.types.essential_auth') }}</li>
                <li>{{ t('legal.cookies.sections.types.essential_security') }}</li>
                <li>{{ t('legal.cookies.sections.types.essential_load') }}</li>
              </ul>
            </div>
            <p class="text-text-secondary leading-relaxed">
              <strong>{{ t('legal.cookies.sections.types.essential_note') }}</strong>
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3 mt-6">
              {{ t('legal.cookies.sections.types.functionality_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.types.functionality_text') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6 mb-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.cookies.sections.types.functionality_examples_title') }}
              </p>
              <ul class="list-disc pl-6 text-text-secondary space-y-2">
                <li>{{ t('legal.cookies.sections.types.functionality_preferences') }}</li>
                <li>{{ t('legal.cookies.sections.types.functionality_progress') }}</li>
                <li>{{ t('legal.cookies.sections.types.functionality_assistant') }}</li>
                <li>{{ t('legal.cookies.sections.types.functionality_chat') }}</li>
              </ul>
            </div>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.types.functionality_note') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3 mt-6">
              {{ t('legal.cookies.sections.types.analytics_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.types.analytics_text') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6 mb-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.cookies.sections.types.analytics_examples_title') }}
              </p>
              <ul class="list-disc pl-6 text-text-secondary space-y-2">
                <li>{{ t('legal.cookies.sections.types.analytics_patterns') }}</li>
                <li>{{ t('legal.cookies.sections.types.analytics_visitors') }}</li>
                <li>{{ t('legal.cookies.sections.types.analytics_effectiveness') }}</li>
                <li>{{ t('legal.cookies.sections.types.analytics_errors') }}</li>
                <li>{{ t('legal.cookies.sections.types.analytics_performance') }}</li>
              </ul>
            </div>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.types.analytics_note') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3 mt-6">
              {{ t('legal.cookies.sections.types.third_party_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.types.third_party_text') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>
                <strong>{{ t('legal.cookies.sections.types.third_party_google') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.types.third_party_ai') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.types.third_party_cdn') }}</strong>
              </li>
            </ul>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.types.third_party_note') }}
            </p>
          </div>

          <!-- 3. Duración -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.duration.title') }}
            </h2>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.cookies.sections.duration.session_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.duration.session_text') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.cookies.sections.duration.persistent_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.duration.persistent_text') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2 mt-4">
              <li>
                <strong>{{ t('legal.cookies.sections.duration.persistent_auth') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.duration.persistent_preferences') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.duration.persistent_analytics') }}</strong>
              </li>
            </ul>
          </div>

          <!-- 4. Gestionar Cookies -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.manage.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.manage.intro') }}
            </p>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3">
              {{ t('legal.cookies.sections.manage.browser_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.manage.browser_text') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>
                <strong>{{ t('legal.cookies.sections.manage.browser_chrome') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.manage.browser_firefox') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.manage.browser_safari') }}</strong>
              </li>
              <li>
                <strong>{{ t('legal.cookies.sections.manage.browser_edge') }}</strong>
              </li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3 mt-6">
              {{ t('legal.cookies.sections.manage.tools_title') }}
            </h3>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.manage.tools_text') }}
            </p>
            <ul class="list-disc pl-6 text-text-secondary space-y-2">
              <li>
                <a
                  href="http://www.youronlinechoices.eu/"
                  target="_blank"
                  rel="noopener"
                  class="link-underline text-purple"
                  >Your Online Choices</a
                >
                (Europa)
              </li>
              <li>
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener"
                  class="link-underline text-purple"
                  >Network Advertising Initiative</a
                >
              </li>
            </ul>

            <h3 class="text-h3 font-semibold text-navy-700 mb-3 mt-6">
              {{ t('legal.cookies.sections.manage.blocking_title') }}
            </h3>
            <div class="bg-yellow/10 border border-yellow rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.cookies.sections.manage.blocking_warning_title') }}
              </p>
              <p class="text-text-secondary leading-relaxed">
                {{ t('legal.cookies.sections.manage.blocking_warning_text') }}
              </p>
            </div>
          </div>

          <!-- 5. Cambios -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.changes.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.cookies.sections.changes.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed mt-4">
              {{ t('legal.cookies.sections.changes.p2') }}
            </p>
          </div>

          <!-- 6. Más Información -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.more_info.title') }}
            </h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.more_info.p1') }}
            </p>
            <p class="text-text-secondary leading-relaxed mb-4">
              {{ t('legal.cookies.sections.more_info.p2') }}
            </p>
            <div class="bg-lilac/10 border border-lilac rounded-xl p-6">
              <p class="text-text-primary font-medium mb-2">
                {{ t('legal.cookies.sections.more_info.company') }}
              </p>
              <p class="text-text-secondary">
                {{ t('legal.cookies.sections.more_info.email_label') }}
                <a href="mailto:privacidad@itakai.com" class="link-underline text-purple"
                  >privacidad@itakai.com</a
                >
              </p>
              <p class="text-text-secondary">
                {{ t('legal.cookies.sections.more_info.support_label') }}
                <a href="mailto:soporte@itakai.com" class="link-underline text-purple"
                  >soporte@itakai.com</a
                >
              </p>
            </div>
          </div>

          <!-- 7. Tabla Resumen -->
          <div class="mb-12">
            <h2 class="text-h2 font-bold text-navy-700 mb-4">
              {{ t('legal.cookies.sections.summary_table.title') }}
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-navy-700 text-white">
                    <th class="border border-border-primary px-4 py-3 text-left">
                      {{ t('legal.cookies.sections.summary_table.col_type') }}
                    </th>
                    <th class="border border-border-primary px-4 py-3 text-left">
                      {{ t('legal.cookies.sections.summary_table.col_purpose') }}
                    </th>
                    <th class="border border-border-primary px-4 py-3 text-left">
                      {{ t('legal.cookies.sections.summary_table.col_duration') }}
                    </th>
                    <th class="border border-border-primary px-4 py-3 text-left">
                      {{ t('legal.cookies.sections.summary_table.col_required') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      class="border border-border-primary px-4 py-3 text-text-primary font-medium"
                    >
                      {{ t('legal.cookies.sections.summary_table.essential_type') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.essential_purpose') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.essential_duration') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.essential_required') }}
                    </td>
                  </tr>
                  <tr class="bg-bg-secondary">
                    <td
                      class="border border-border-primary px-4 py-3 text-text-primary font-medium"
                    >
                      {{ t('legal.cookies.sections.summary_table.functionality_type') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.functionality_purpose') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.functionality_duration') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.functionality_required') }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="border border-border-primary px-4 py-3 text-text-primary font-medium"
                    >
                      {{ t('legal.cookies.sections.summary_table.analytics_type') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.analytics_purpose') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.analytics_duration') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.analytics_required') }}
                    </td>
                  </tr>
                  <tr class="bg-bg-secondary">
                    <td
                      class="border border-border-primary px-4 py-3 text-text-primary font-medium"
                    >
                      {{ t('legal.cookies.sections.summary_table.third_party_type') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.third_party_purpose') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.third_party_duration') }}
                    </td>
                    <td class="border border-border-primary px-4 py-3 text-text-secondary">
                      {{ t('legal.cookies.sections.summary_table.third_party_required') }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
  title: () => t('legal.cookies.meta.title'),
  meta: [{ name: 'description', content: () => t('legal.cookies.meta.description') }],
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
