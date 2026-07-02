/**
 * Composable useToast
 * Sistema de toasts custom con estilo ITAKAI
 */

import type { ToastOptions } from '~/types/notification.types'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration: number
}

// Estado global reactivo para los toasts
const toasts = ref<Toast[]>([])
let toastId = 0

const addToast = (type: ToastType, message: string, options?: ToastOptions) => {
  const id = ++toastId
  const duration = options?.duration || 2000

  toasts.value.push({ id, type, message, duration })

  // Auto-remove después del duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions): void => {
    addToast('success', message, options)
  }

  const error = (message: string, options?: ToastOptions): void => {
    addToast('error', message, options)
  }

  const warning = (message: string, options?: ToastOptions): void => {
    addToast('warning', message, options)
  }

  const info = (message: string, options?: ToastOptions): void => {
    addToast('info', message, options)
  }

  return {
    toasts: readonly(toasts),
    success,
    error,
    warning,
    info,
    removeToast,
  }
}
