import { prisma } from '../src/config/database.js'

// Guide avatar mapping
const guideAvatars: Record<string, string> = {
  atenea: '/app/avatars/atenea.svg',
  odiseo: '/app/avatars/odiseo.svg',
  penelope: '/app/avatars/penelope.svg',
  polifemo: '/app/avatars/polifemo.svg',
  poseidon: '/app/avatars/poseidon.svg',
}

async function migrateActivities() {
  console.log('Starting activity migration...')

  // 1. Recreate activities for approved submissions
  console.log('\n1. Recreating activities for submissions...')
  const submissions = await prisma.enigmaSubmission.findMany({
    where: { status: { in: ['aprobada', 'pendiente'] } },
    include: {
      enigma: { include: { mission: { include: { class: true } } } },
      student: true,
    },
    orderBy: { submittedAt: 'asc' },
  })

  for (const submission of submissions) {
    const enrollment = await prisma.classEnrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: submission.studentId,
          classId: submission.enigma.mission.classId,
        },
      },
    })

    if (!enrollment) {
      console.log(`⚠️  Skipping submission ${submission.id} - no enrollment found`)
      continue
    }

    const avatar = enrollment.guideId
      ? guideAvatars[enrollment.guideId]
      : enrollment.avatarUrl || '/app/avatars/atenea.svg'

    // Create enigma_submitted activity
    await prisma.activity.create({
      data: {
        userId: submission.studentId,
        type: 'enigma_submitted',
        description: `Has enviado "${submission.enigma.title}" a revisión`,
        avatar,
        username: enrollment.nickname || 'Estudiante',
        classId: submission.enigma.mission.classId,
        className: submission.enigma.mission.class.name,
        enigmaTitle: submission.enigma.title,
        createdAt: submission.submittedAt,
        metadata: {
          enigmaId: submission.enigmaId,
          missionId: submission.enigma.missionId,
          submissionId: submission.id,
        },
      },
    })
    console.log(`✓ Created enigma_submitted activity for submission ${submission.id}`)

    // If approved, create enigma_completed activity
    if (submission.status === 'aprobada' && submission.reviewedAt) {
      await prisma.activity.create({
        data: {
          userId: submission.studentId,
          type: 'enigma_completed',
          description: `Tu entrega de "${submission.enigma.title}" fue aprobada`,
          avatar,
          username: enrollment.nickname || 'Estudiante',
          classId: submission.enigma.mission.classId,
          className: submission.enigma.mission.class.name,
          enigmaTitle: submission.enigma.title,
          enigmaXp: submission.xpAwarded || 0,
          createdAt: submission.reviewedAt,
          metadata: {
            enigmaId: submission.enigmaId,
            missionId: submission.enigma.missionId,
          },
        },
      })
      console.log(`✓ Created enigma_completed activity for submission ${submission.id}`)
    }
  }

  // 2. Recreate activities for completed missions
  console.log('\n2. Recreating activities for completed missions...')
  const completedMissions = await prisma.studentMissionProgress.findMany({
    where: { completedAt: { not: null } },
    include: {
      mission: { include: { class: true } },
      student: true,
    },
    orderBy: { completedAt: 'asc' },
  })

  for (const progress of completedMissions) {
    const enrollment = await prisma.classEnrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: progress.studentId,
          classId: progress.mission.classId,
        },
      },
    })

    if (!enrollment) {
      console.log(`⚠️  Skipping mission ${progress.missionId} - no enrollment found`)
      continue
    }

    const avatar = enrollment.guideId
      ? guideAvatars[enrollment.guideId]
      : enrollment.avatarUrl || '/app/avatars/atenea.svg'

    await prisma.activity.create({
      data: {
        userId: progress.studentId,
        type: 'mission_completed',
        description: `Has completado la misión "${progress.mission.title}"`,
        avatar,
        username: enrollment.nickname || 'Estudiante',
        classId: progress.mission.classId,
        className: progress.mission.class.name,
        missionTitle: progress.mission.title,
        missionXp: progress.mission.xpReward,
        createdAt: progress.completedAt!,
        metadata: { missionId: progress.missionId },
      },
    })
    console.log(`✓ Created mission_completed activity for mission ${progress.missionId}`)
  }

  // 3. Recreate class_joined activities for all enrollments
  console.log('\n3. Recreating class_joined activities...')
  const enrollments = await prisma.classEnrollment.findMany({
    include: { class: true, student: true },
    orderBy: { enrolledAt: 'asc' },
  })

  for (const enrollment of enrollments) {
    const avatar = enrollment.guideId
      ? guideAvatars[enrollment.guideId]
      : enrollment.avatarUrl || '/app/avatars/atenea.svg'

    await prisma.activity.create({
      data: {
        userId: enrollment.studentId,
        type: 'class_joined',
        description: `Te has unido a la clase ${enrollment.class.name}`,
        avatar,
        username: enrollment.nickname || 'Estudiante',
        classId: enrollment.classId,
        className: enrollment.class.name,
        createdAt: enrollment.enrolledAt,
        metadata: { classId: enrollment.classId },
      },
    })
    console.log(`✓ Created class_joined activity for enrollment ${enrollment.id}`)
  }

  console.log('\n✅ Migration completed successfully!')
}

migrateActivities()
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
