/**
 * Script to recalculate levels for all students based on their current XP
 * This fixes the levels for existing data
 */

import { prisma } from '../config/database.js'
import { getLevelInfo } from '../utils/xp-calculator.js'

async function recalculateLevels() {
  console.log('🔄 Recalculating levels for all students...\n')

  // Get all class enrollments
  const enrollments = await prisma.classEnrollment.findMany({
    include: {
      student: { select: { name: true } },
      class: { select: { name: true } },
    },
  })

  let updated = 0

  for (const enrollment of enrollments) {
    const levelInfo = getLevelInfo(enrollment.xp)
    const correctLevel = levelInfo.level

    if (correctLevel !== enrollment.level) {
      await prisma.classEnrollment.update({
        where: {
          studentId_classId: {
            studentId: enrollment.studentId,
            classId: enrollment.classId,
          },
        },
        data: { level: correctLevel },
      })

      console.log(
        `📊 ${enrollment.student.name} in "${enrollment.class.name}": Level ${enrollment.level} → Level ${correctLevel} (${enrollment.xp} XP)`
      )
      updated++
    } else {
      console.log(
        `✅ ${enrollment.student.name} in "${enrollment.class.name}": Level ${correctLevel} (${enrollment.xp} XP) - OK`
      )
    }
  }

  console.log(`\n✨ Done! Updated ${updated} enrollments.`)
}

recalculateLevels()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
