import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useNotificationsStore } from '~/stores/notifications'

/**
 * Composable para gestionar notificaciones del usuario
 * Wrapper around the notifications store for easy access in components
 */
export function useNotifications() {
  const store = useNotificationsStore()
  const { notifications, loading, unreadCount } = storeToRefs(store)

  const hasUnread = computed(() => unreadCount.value > 0)

  const sortedNotifications = computed(() =>
    [...notifications.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  return {
    // State
    notifications: sortedNotifications,
    isLoading: loading,
    unreadCount,
    hasUnread,

    // Actions
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    deleteNotification: store.deleteNotification,
    addNotification: (notification: any) => {
      // For backwards compatibility
      notifications.value.unshift(notification)
    },
  }
}
