import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../config/database.js'

export async function classesRoutes(fastify: FastifyInstance) {
  // Public class info by invitation code (for join flow)
  fastify.get('/by-code/:code', async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
    try {
      const { code } = request.params
      const cls = await prisma.class.findUnique({
        where: { invitationCode: code },
        include: { teacher: true },
      })

      if (!cls) {
        return reply.status(404).send({ message: 'Clase no encontrada' })
      }

      if (cls.archived) {
        return reply.status(410).send({ message: 'La clase está archivada' })
      }

      return {
        class: {
          id: cls.id,
          name: cls.name,
          teacherName: cls.teacher.name,
          backgroundImage: cls.backgroundImage,
        },
      }
    } catch (error) {
      return reply.status(500).send({ message: 'Error interno' })
    }
  })
}
