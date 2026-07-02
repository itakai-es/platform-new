import { describe, it, expect, vi, beforeEach } from 'vitest'
import Fastify from 'fastify'
import { healthRoutes } from '../../src/modules/health/health.routes.js'

// Mock the database module
vi.mock('../../src/config/database.js', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

import { prisma } from '../../src/config/database.js'

describe('Health Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeEach(async () => {
    vi.clearAllMocks()
    app = Fastify()
    await app.register(healthRoutes, { prefix: '/health' })
    await app.ready()
  })

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.payload)
      expect(body.status).toBe('ok')
      expect(body.timestamp).toBeDefined()
      expect(body.uptime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('GET /health/db', () => {
    it('should return connected when database is available', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }])

      const response = await app.inject({
        method: 'GET',
        url: '/health/db',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.payload)
      expect(body.status).toBe('ok')
      expect(body.database).toBe('connected')
    })

    it('should return 503 when database is unavailable', async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection refused'))

      const response = await app.inject({
        method: 'GET',
        url: '/health/db',
      })

      expect(response.statusCode).toBe(503)
      const body = JSON.parse(response.payload)
      expect(body.status).toBe('error')
      expect(body.database).toBe('disconnected')
    })
  })
})
