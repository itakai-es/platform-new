import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../config/database.js'

export async function notificationsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', fastify.authenticate)

  // Get notifications
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.user as { id: string }

      const notifications = await prisma.notification.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })

      const unreadCount = await prisma.notification.count({
        where: { userId: id, isRead: false },
      })

      return {
        notifications: notifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          priority: n.priority,
          isRead: n.isRead,
          actionUrl: n.actionUrl,
          metadata: n.metadata,
          createdAt: n.createdAt,
        })),
        total: notifications.length,
        unreadCount,
      }
    } catch (error) {
      return reply.status(500).send({ message: 'Error interno' })
    }
  })

  // Mark notification as read
  fastify.put('/:notificationId/read', async (request: FastifyRequest<{ Params: { notificationId: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.user as { id: string }
      const { notificationId } = request.params

      const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId: id },
      })

      if (!notification) {
        return reply.status(404).send({ message: 'Notificación no encontrada' })
      }

      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      })

      return { success: true, notification: updated }
    } catch (error) {
      return reply.status(500).send({ message: 'Error interno' })
    }
  })

  // Mark all as read
  fastify.put('/read-all', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.user as { id: string }

      await prisma.notification.updateMany({
        where: { userId: id, isRead: false },
        data: { isRead: true },
      })

      return { success: true, message: 'Todas las notificaciones marcadas como leídas' }
    } catch (error) {
      return reply.status(500).send({ message: 'Error interno' })
    }
  })

  // Delete notification
  fastify.delete('/:notificationId', async (request: FastifyRequest<{ Params: { notificationId: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.user as { id: string }
      const { notificationId } = request.params

      const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId: id },
      })

      if (!notification) {
        return reply.status(404).send({ message: 'Notificación no encontrada' })
      }

      await prisma.notification.delete({ where: { id: notificationId } })

      return { success: true, message: 'Notificación eliminada' }
    } catch (error) {
      return reply.status(500).send({ message: 'Error interno' })
    }
  })
}
