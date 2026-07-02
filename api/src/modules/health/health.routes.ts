import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database.js'

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  })

  // Database health check
  fastify.get('/db', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return reply.status(503).send({
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      })
    }
  })
}
