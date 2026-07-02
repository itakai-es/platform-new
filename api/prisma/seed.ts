import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...\n')

  // 1. Create users (2 per role, password = email)
  console.log('Creating users...')

  const users = [
    { email: 'sofia.garcia@itakai.es', name: 'Sofía García Pérez', role: 'student' as const },
    { email: 'miguel.lopez@itakai.es', name: 'Miguel López Ruiz', role: 'student' as const },
    { email: 'elena.sanchez@itakai.es', name: 'Elena Sánchez Torres', role: 'teacher' as const },
    { email: 'antonio.garcia@itakai.es', name: 'Antonio García Ruiz', role: 'teacher' as const },
    { email: 'admin@itakai.es', name: 'Admin Principal', role: 'admin' as const },
    { email: 'soporte@itakai.es', name: 'Admin Secundario', role: 'admin' as const },
  ]

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.email, 10)
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash },
      create: {
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        isOnboarded: true,
      },
    })
  }
  console.log(`  ✅ ${users.length} users created (2 per role)`)

  // 2. Create system badges (teacherId = null, auto-awarded)
  console.log('Creating system badges...')

  const systemBadges = [
    // Missions completed
    { name: 'Templo del Héroe', description: 'Completa tu primera misión', imageUrl: '/badges/templo-heroe.svg', category: 'missions', rarity: 'common', triggerType: 'missions_completed', triggerValue: 1 },
    { name: 'Guerrero de Bronce', description: 'Completa 10 misiones', imageUrl: '/badges/guerrero-bronce.svg', category: 'missions', rarity: 'common', triggerType: 'missions_completed', triggerValue: 10 },
    { name: 'Guerrero de Plata', description: 'Completa 25 misiones', imageUrl: '/badges/guerrero-plata.svg', category: 'missions', rarity: 'rare', triggerType: 'missions_completed', triggerValue: 25 },
    { name: 'Guerrero de Oro', description: 'Completa 50 misiones', imageUrl: '/badges/guerrero-oro.svg', category: 'missions', rarity: 'epic', triggerType: 'missions_completed', triggerValue: 50 },
    { name: 'Campeón Olímpico', description: 'Completa 100 misiones', imageUrl: '/badges/campeon-olimpico.svg', category: 'missions', rarity: 'legendary', triggerType: 'missions_completed', triggerValue: 100 },
    // XP total
    { name: 'Ambrosía del Novato', description: 'Alcanza 500 XP en una clase', imageUrl: '/badges/ambrosia-novato.svg', category: 'xp', rarity: 'common', triggerType: 'xp_total', triggerValue: 500 },
    { name: 'Néctar de Progreso', description: 'Alcanza 2.500 XP en una clase', imageUrl: '/badges/nectar-progreso.svg', category: 'xp', rarity: 'rare', triggerType: 'xp_total', triggerValue: 2500 },
    { name: 'Tridente de Poseidón', description: 'Alcanza 10.000 XP en una clase', imageUrl: '/badges/tridente-poseidon.svg', category: 'xp', rarity: 'epic', triggerType: 'xp_total', triggerValue: 10000 },
    { name: 'Rayo de Zeus', description: 'Alcanza 50.000 XP en una clase', imageUrl: '/badges/rayo-zeus.svg', category: 'xp', rarity: 'legendary', triggerType: 'xp_total', triggerValue: 50000 },
    // Level reached
    { name: 'Iniciado', description: 'Alcanza el nivel 5 en una clase', imageUrl: '/badges/iniciado.svg', category: 'level', rarity: 'common', triggerType: 'level_reached', triggerValue: 5 },
    { name: 'Corona de Laurel', description: 'Alcanza el nivel 15 en una clase', imageUrl: '/badges/corona-laurel.svg', category: 'level', rarity: 'rare', triggerType: 'level_reached', triggerValue: 15 },
    { name: 'Manto de Hera', description: 'Alcanza el nivel 30 en una clase', imageUrl: '/badges/manto-hera.svg', category: 'level', rarity: 'epic', triggerType: 'level_reached', triggerValue: 30 },
    { name: 'Trono del Olimpo', description: 'Alcanza el nivel 50 en una clase', imageUrl: '/badges/trono-olimpo.svg', category: 'level', rarity: 'legendary', triggerType: 'level_reached', triggerValue: 50 },
  ]

  for (const badge of systemBadges) {
    const existing = await prisma.badge.findFirst({
      where: { name: badge.name, teacherId: null },
    })
    if (existing) {
      await prisma.badge.update({ where: { id: existing.id }, data: badge })
    } else {
      await prisma.badge.create({ data: badge })
    }
  }
  console.log(`  ✅ ${systemBadges.length} system badges created`)

  console.log('\n✨ Seed completed!\n')
  console.log('Users (password = email):')
  for (const u of users) {
    console.log(`  ${u.role.padEnd(7)} → ${u.email}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
