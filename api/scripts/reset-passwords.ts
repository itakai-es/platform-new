import bcrypt from 'bcryptjs'
import { prisma } from '../src/config/database.js'

if (process.env.NODE_ENV === 'production') {
  console.error('This script must not run in production')
  process.exit(1)
}

async function updatePasswords() {
  const users = await prisma.user.findMany()

  for (const user of users) {
    const newPassword = user.email
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })
    console.log('Updated:', user.email)
  }

  console.log('Done! All passwords set to email')
  await prisma.$disconnect()
}

updatePasswords().catch(console.error)
