export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Load user from localStorage on app initialization
  await authStore.loadUserFromStorage()
})
