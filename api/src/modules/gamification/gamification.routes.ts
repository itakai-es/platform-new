import type { FastifyInstance } from 'fastify'

export async function gamificationRoutes(fastify: FastifyInstance) {
  // Get available guides/avatars
  fastify.get('/guides', async () => {
    // Return hardcoded guides for now
    // TODO: Move this to database when Guide table is created
    return {
      guides: [
        {
          id: 'atenea',
          name: 'Atenea',
          trait: 'Sabiduría y Estrategia',
          avatar: '/app/avatars/atenea.svg',
          description: 'Diosa de la sabiduría, la estrategia y la guerra justa',
        },
        {
          id: 'odiseo',
          name: 'Odiseo',
          trait: 'Astucia y Valentía',
          avatar: '/app/avatars/odiseo.svg',
          description: 'Héroe legendario conocido por su ingenio y valentía',
        },
        {
          id: 'penelope',
          name: 'Penélope',
          trait: 'Lealtad y Paciencia',
          avatar: '/app/avatars/penelope.svg',
          description: 'Reina de Ítaca, símbolo de fidelidad y perseverancia',
        },
        {
          id: 'polifemo',
          name: 'Polifemo',
          trait: 'Fuerza y Determinación',
          avatar: '/app/avatars/polifemo.svg',
          description: 'Cíclope de gran fuerza y determinación',
        },
        {
          id: 'poseidon',
          name: 'Poseidón',
          trait: 'Poder y Dominio',
          avatar: '/app/avatars/poseidon.svg',
          description: 'Dios de los mares y los océanos',
        },
      ],
    }
  })
}
