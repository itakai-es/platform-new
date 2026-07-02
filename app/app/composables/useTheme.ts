export const useTheme = () => {
  const profileStore = useProfileStore()

  const theme = computed(() => profileStore.preferences?.theme || 'college')

  // Writes data-theme to DOM AND persists to localStorage.
  // Only call this on explicit user actions (changing theme in profile settings).
  const applyTheme = (themeName: string) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', themeName)
      localStorage.setItem('itakai_theme', themeName)
    }
  }

  // Watch for profile theme changes and update DOM only — never touch localStorage.
  // This fires immediately during setup() with the default 'college' value (profile not
  // loaded yet), so writing to localStorage here would overwrite the stored theme.
  watch(
    theme,
    newTheme => {
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    },
    { immediate: true }
  )

  // Restore theme from localStorage before profile loads (called from onMounted).
  // Runs after the watch's immediate call, so it correctly overrides the default.
  const initTheme = () => {
    if (import.meta.client) {
      const storedTheme = localStorage.getItem('itakai_theme')
      if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme)
      }
    }
  }

  return { theme, applyTheme, initTheme }
}
