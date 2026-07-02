import { getDashboardByRole } from '~/utils/navigation'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Si ya está autenticado, redirigir a su dashboard
  if (authStore.isAuthenticated) {
    const userRole = authStore.user?.role
    return navigateTo(getDashboardByRole(userRole ?? ''), { replace: true })
  }
})
