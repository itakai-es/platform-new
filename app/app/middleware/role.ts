import { getDashboardByRole } from '~/utils/navigation'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const userRole = authStore.user?.role

  // 1. Verificar si hay allowedRoles (lista de roles permitidos)
  const allowedRoles = to.meta.allowedRoles as string[] | undefined
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return navigateTo(getDashboardByRole(userRole ?? ''), { replace: true })
    }
    // Si el rol está en allowedRoles, permitir acceso
    return
  }

  // 2. Verificar si hay un rol específico en page meta
  let requiredRole = to.meta.role as string | undefined

  // 3. Si no hay rol definido en meta, inferir desde la ruta
  if (!requiredRole) {
    const path = to.path
    if (path.startsWith('/alumno')) {
      requiredRole = 'student'
    } else if (path.startsWith('/profesor')) {
      requiredRole = 'teacher'
    } else if (path.startsWith('/admin')) {
      requiredRole = 'admin'
    }
  }

  // 4. Si hay un rol requerido y el usuario no lo tiene, redirigir
  if (requiredRole && userRole !== requiredRole) {
    return navigateTo(getDashboardByRole(userRole ?? ''), { replace: true })
  }
})
