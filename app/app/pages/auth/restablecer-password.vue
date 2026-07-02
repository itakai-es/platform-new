<template>
  <div class="min-h-screen bg-navy-700 flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl space-y-6">
      <div class="space-y-2 text-center">
        <h1 class="text-3xl font-bold text-navy-700">{{ t('auth.reset_password.card_title') }}</h1>
        <p class="text-navy-700/70">{{ t('auth.reset_password.card_subtitle') }}</p>
      </div>

      <div v-if="successMessage" class="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleResetPassword">
        <input
          type="text"
          name="username"
          autocomplete="username"
          aria-hidden="true"
          tabindex="-1"
          class="sr-only"
        />

        <FormField
          v-model="password"
          :label="t('auth.reset_password.password_label')"
          type="password"
          :placeholder="t('auth.reset_password.password_placeholder')"
          autocomplete="new-password"
          required
        />

        <FormField
          v-model="confirmPassword"
          :label="t('auth.reset_password.confirm_password_label')"
          type="password"
          :placeholder="t('auth.reset_password.confirm_password_placeholder')"
          autocomplete="new-password"
          required
        />

        <Button variant="primary" size="lg" class="w-full" :loading="isLoading" type="submit">
          {{
            isLoading
              ? t('auth.reset_password.submit_loading')
              : t('auth.reset_password.submit_button')
          }}
        </Button>
      </form>

      <NuxtLink
        to="/auth/login"
        class="block text-center text-sm font-medium text-purple hover:text-purple-dark"
      >
        {{ t('auth.reset_password.back_to_login') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead(() => ({
  title: t('auth.reset_password.page_title'),
  meta: [{ name: 'description', content: t('auth.reset_password.page_description') }],
}))

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleResetPassword() {
  errorMessage.value = ''
  successMessage.value = ''

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    errorMessage.value = t('auth.reset_password.validation.token_missing')
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = t('auth.reset_password.validation.password_too_short')
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('auth.reset_password.validation.passwords_dont_match')
    return
  }

  try {
    isLoading.value = true
    await authStore.resetPassword(token, password.value)

    // Always use the i18n message (backend message is fixed Spanish, ignore it)
    successMessage.value = t('auth.reset_password.validation.success')
    password.value = ''
    confirmPassword.value = ''
  } catch (error: any) {
    void error
    errorMessage.value = t('auth.reset_password.validation.reset_error')
  } finally {
    isLoading.value = false
  }
}
</script>
