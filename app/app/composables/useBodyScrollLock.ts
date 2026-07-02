/**
 * Composable to lock/unlock body scroll
 * Useful for modals, sidebars, and overlays
 */
export function useBodyScrollLock() {
  /**
   * Lock body scroll
   * Prevents scrolling of the background when overlay/modal is open
   */
  const lock = () => {
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  }

  /**
   * Unlock body scroll
   * Restores normal scrolling behavior
   */
  const unlock = () => {
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }

  return { lock, unlock }
}
