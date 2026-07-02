import { getDashboardByRole, ROUTE_NAMES } from '~/utils/navigation'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()

  // Si el usuario está autenticado pero no ha completado onboarding
  if (authStore.isAuthenticated && !authStore.user?.isOnboarded) {
    // Si está intentando acceder a una ruta que NO es onboarding
    if (!to.path.startsWith('/onboarding')) {
      // Redirigir a onboarding
      return navigateTo('/onboarding/seleccion-rol')
    }
  }

  // Si el usuario ya completó onboarding y está intentando acceder a onboarding
  if (authStore.isAuthenticated && authStore.user?.isOnboarded) {
    if (to.path.startsWith('/onboarding')) {
      // Redirigir al dashboard según su rol (solo si es un rol conocido)
      const role = authStore.user.role
      const dashboard = role ? getDashboardByRole(role) : null
      if (dashboard && dashboard !== ROUTE_NAMES.HOME) {
        return navigateTo(dashboard)
      }
    }
  }
})
