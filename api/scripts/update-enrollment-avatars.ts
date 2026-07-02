import { prisma } from '../src/config/database.js'

// Default avatar options (Greek gods)
const DEFAULT_AVATARS = [
  '/app/avatars/atenea.svg',
  '/app/avatars/odiseo.svg',
  '/app/avatars/penelope.svg',
  '/app/avatars/polifemo.svg',
  '/app/avatars/poseidon.svg',
]

/**
 * Selects a random default avatar URL
 */
function getRandomAvatar(): string {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]
}

async function updateEnrollmentAvatars() {
  console.log('Starting enrollment avatars update...')

  // Find all enrollments with NULL avatar_url
  const enrollments = await prisma.classEnrollment.findMany({
    where: { avatarUrl: null },
  })

  console.log(`\nFound ${enrollments.length} enrollments with NULL avatar_url`)

  for (const enrollment of enrollments) {
    const randomAvatar = getRandomAvatar()

    await prisma.classEnrollment.update({
      where: { id: enrollment.id },
      data: { avatarUrl: randomAvatar },
    })

    console.log(
      `✓ Updated enrollment ${enrollment.id} with avatar: ${randomAvatar}`
    )
  }

  console.log('\n✅ Update completed successfully!')
}

updateEnrollmentAvatars()
  .catch((error) => {
    console.error('❌ Update failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
