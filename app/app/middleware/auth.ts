export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login', { replace: true })
  }

  // Si el token ha expirado, intentar renovarlo
  if (authStore.isTokenExpired) {
    try {
      await authStore.refreshToken()
      // Si llegamos aquí, el token se renovó correctamente
    } catch {
      // Si falla la renovación, limpiar estado y redirigir a login
      authStore.clearAuthState()
      return navigateTo('/auth/login', { replace: true })
    }
  }
})
