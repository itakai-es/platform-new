import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { SYSTEM_BADGES } from './system-badges.js'

/**
 * Bootstrap para AUTO-HOSPEDAJE: crea las insignias del sistema y UN administrador
 * a partir de `ADMIN_EMAIL` + `ADMIN_PASSWORD` (sin usuarios de demostración ni
 * contraseñas por defecto). Idempotente: si el admin ya existe, no toca su
 * contraseña.
 *
 * Uso: ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm db:bootstrap
 */

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Bootstrap de la instancia...\n')

  // 1. Insignias del sistema (idempotente)
  for (const badge of SYSTEM_BADGES) {
    const existing = await prisma.badge.findFirst({ where: { name: badge.name, teacherId: null } })
    if (existing) {
      await prisma.badge.update({ where: { id: existing.id }, data: badge })
    } else {
      await prisma.badge.create({ data: badge })
    }
  }
  console.log(`  ✅ ${SYSTEM_BADGES.length} insignias del sistema`)

  // 2. Administrador desde variables de entorno
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.error('\n❌ Define ADMIN_EMAIL y ADMIN_PASSWORD para crear el administrador.')
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`  ℹ️  El admin ${email} ya existe — no se toca su contraseña.`)
  } else {
    await prisma.user.create({
      data: {
        email,
        name: 'Administrador',
        role: 'admin',
        isOnboarded: true,
        passwordHash: await bcrypt.hash(password, 10),
      },
    })
    console.log(`  ✅ Administrador ${email} creado.`)
  }

  console.log('\n✨ Bootstrap completado.')
}

main()
  .catch((e) => {
    console.error('❌ Bootstrap falló:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
