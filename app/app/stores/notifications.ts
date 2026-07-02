/**
 * Store de Notificaciones
 * Maneja notificaciones persistentes y mensajes toast temporales
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Notification,
  ToastMessage,
  ToastSeverity,
  ToastOptions,
  NotificationFilter,
  NotificationsResponse,
} from '~/types/notification.types'
import { useToast } from '~/composables/useToast'

export const useNotificationsStore = defineStore('notifications', () => {
  // Estado
  const notifications = ref<Notification[]>([])
  const toasts = ref<ToastMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Flag explícito por endpoint para que `ensureNotifications()` sepa si
  // saltar la llamada sin tener que mirar si los datos están vacíos (una
  // respuesta vacía tras fetchar es válida y no debe disparar refetch).
  // Las mutaciones locales (mark/delete) NO invalidan este flag: mantienen
  // la lista sincronizada sin forzar un refetch completo.
  const hasLoadedNotifications = ref(false)

  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead)
  })

  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.isRead)
  })

  /**
   * Obtener notificaciones filtradas
   */
  const getNotificationsByFilter = (filter: NotificationFilter): Notification[] => {
    switch (filter) {
      case 'unread':
        return unreadNotifications.value
      case 'read':
        return readNotifications.value
      case 'all':
      default:
        return notifications.value
    }
  }

  /**
   * Cargar notificaciones desde el servidor (forzado, sin chequear bandera).
   * Mantiene compatibilidad con llamadas existentes que necesiten refetch.
   * Para carga idempotente preferir `ensureNotifications()`.
   */
  const fetchNotifications = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const response = await $fetch<NotificationsResponse>(
        `${config.public.apiBase}/notifications`,
        {
          method: 'GET',
        }
      )

      notifications.value = response.notifications.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }))
      hasLoadedNotifications.value = true
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar notificaciones'
      console.error('Error fetching notifications:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Carga las notificaciones si no se han cargado todavía (o si `force=true`).
   * Es idempotente: llamadas repetidas no disparan más de un fetch en vuelo.
   * Las mutaciones locales (mark/delete) no resetean la bandera, por lo que
   * la lista se mantiene sincronizada sin necesidad de refetch.
   */
  const ensureNotifications = async (force = false): Promise<void> => {
    if (hasLoadedNotifications.value && !force) return
    if (loading.value) return
    await fetchNotifications()
  }

  /**
   * Marcar una notificación como leída
   */
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBase}/notifications/${notificationId}/read`, {
        method: 'PUT',
      })

      // Actualizar localmente - solo copiar la notificación que cambió
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        const updatedArray = [...notifications.value]
        updatedArray[index] = {
          ...updatedArray[index],
          isRead: true,
          updatedAt: new Date(),
        }
        notifications.value = updatedArray
      }
    } catch (err: any) {
      error.value = err?.message || 'Error al marcar notificación'
      console.error('Error marking notification as read:', err)
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = async (): Promise<void> => {
    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBase}/notifications/read-all`, {
        method: 'PUT',
      })

      // Actualizar localmente - marcar todas como leídas eficientemente
      const now = new Date()
      const updatedArray = notifications.value.map(n => ({
        ...n,
        isRead: true,
        updatedAt: now,
      }))
      notifications.value = updatedArray
    } catch (err: any) {
      error.value = err?.message || 'Error al marcar todas las notificaciones'
      console.error('Error marking all notifications as read:', err)
    }
  }

  /**
   * Eliminar una notificación
   */
  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBase}/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      // Eliminar localmente
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err?.message || 'Error al eliminar notificación'
      console.error('Error deleting notification:', err)
    }
  }

  /**
   * Agregar una notificación (desde websocket o evento)
   */
  const addNotification = (notification: Notification): void => {
    notifications.value.unshift(notification)
  }

  // ========== TOAST MESSAGES (using useToast composable) ==========

  // Toast functions are provided by useToast composable
  // These are thin wrappers for backwards compatibility with the store interface
  const toastComposable = useToast()

  /**
   * Mostrar mensaje toast
   */
  const showToast = (
    severity: ToastSeverity,
    message: string,
    options: ToastOptions = {}
  ): void => {
    switch (severity) {
      case 'success':
        toastComposable.success(message, options)
        break
      case 'error':
        toastComposable.error(message, options)
        break
      case 'warning':
        toastComposable.warning(message, options)
        break
      case 'info':
        toastComposable.info(message, options)
        break
      default:
        toastComposable.info(message, options)
    }
  }

  /**
   * Cerrar un toast específico
   */
  const dismissToast = (toastId: number): void => {
    toastComposable.removeToast(toastId)
  }

  /**
   * Helpers para mostrar toasts por tipo
   */
  const success = (message: string, options?: ToastOptions): void => {
    toastComposable.success(message, options)
  }

  const showError = (message: string, options?: ToastOptions): void => {
    toastComposable.error(message, options)
  }

  const warning = (message: string, options?: ToastOptions): void => {
    toastComposable.warning(message, options)
  }

  const info = (message: string, options?: ToastOptions): void => {
    toastComposable.info(message, options)
  }

  /**
   * Limpiar todas las notificaciones (solo para testing/desarrollo)
   */
  const clearAll = (): void => {
    notifications.value = []
    toasts.value = []
    error.value = null
    hasLoadedNotifications.value = false
  }

  return {
    // Estado
    notifications,
    toasts,
    loading,
    error,
    hasLoadedNotifications,

    // Computed
    unreadCount,
    unreadNotifications,
    readNotifications,

    // Actions - Notificaciones persistentes
    fetchNotifications,
    ensureNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationsByFilter,

    // Actions - Toast messages
    showToast,
    dismissToast,
    success,
    showError,
    warning,
    info,

    // Helpers
    clearAll,
  }
})
