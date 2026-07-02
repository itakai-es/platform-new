/**
 * Central helper for auto-awarding system-level badges.
 *
 * System badges have `teacher_id = NULL` and a non-null `trigger_type` +
 * `trigger_value`. This helper is the ONLY place that decides whether a
 * student has crossed a threshold. Call it from anywhere a relevant counter
 * changes (XP delta, mission completion, etc.) — it is idempotent thanks to
 * the `@@unique([studentId, badgeId])` constraint on StudentBadge.
 */

import { prisma as defaultPrisma } from '../config/database.js'

type Client = typeof defaultPrisma | Parameters<Parameters<typeof defaultPrisma.$transaction>[0]>[0]

export type SystemBadgeTriggerType = 'missions_completed' | 'xp_total' | 'level_reached'

interface AwardedBadge {
  id: string
  name: string
  rarity: string
  imageUrl: string | null
  triggerType: SystemBadgeTriggerType
  triggerValue: number
}

/**
 * Checks which system badges the student has newly unlocked and inserts them
 * atomically. Also emits an Activity row and a Notification per awarded badge
 * so the student gets the timeline entry and the bell icon update.
 *
 * Returns the badges that were actually awarded in this call. Missing-badge
 * and already-owned cases return an empty list.
 */
export async function awardSystemBadges(
  studentId: string,
  tx?: Client,
): Promise<AwardedBadge[]> {
  const client: Client = (tx ?? defaultPrisma) as Client

  // Load the student's current progress counters in parallel. These are the
  // only three signals that drive system badges today.
  const [missionsCompleted, enrollmentAggregate] = await Promise.all([
    client.studentMissionProgress.count({
      where: { studentId, completedAt: { not: null } },
    }),
    client.classEnrollment.aggregate({
      where: { studentId },
      _max: { xp: true, level: true },
    }),
  ])

  const maxXp = enrollmentAggregate._max.xp ?? 0
  const maxLevel = enrollmentAggregate._max.level ?? 1

  // Pull every system badge the student is eligible for but doesn't own yet.
  // One query, evaluated against the three counters via OR branches. The
  // subquery on student_badges guarantees we don't try to insert duplicates
  // (the unique constraint would catch it anyway, but this is cheaper).
  const eligible = await client.badge.findMany({
    where: {
      teacherId: null,
      triggerType: { not: null },
      triggerValue: { not: null },
      OR: [
        { triggerType: 'missions_completed', triggerValue: { lte: missionsCompleted } },
        { triggerType: 'xp_total', triggerValue: { lte: maxXp } },
        { triggerType: 'level_reached', triggerValue: { lte: maxLevel } },
      ],
      students: { none: { studentId } },
    },
  })

  if (eligible.length === 0) return []

  const awarded: AwardedBadge[] = []
  for (const badge of eligible) {
    try {
      await client.studentBadge.create({
        data: { studentId, badgeId: badge.id },
      })
    } catch {
      // Unique constraint violation — raced with another writer. Skip it.
      continue
    }

    await client.activity.create({
      data: {
        userId: studentId,
        type: 'badge_earned',
        description: `Obtuvo la insignia "${badge.name}"`,
        badgeName: badge.name,
        badgeRarity: badge.rarity,
        badgeImage: badge.imageUrl,
      },
    })

    await client.notification.create({
      data: {
        userId: studentId,
        type: 'badge_earned',
        title: '¡Nueva insignia desbloqueada!',
        message: `Has ganado "${badge.name}"`,
        priority: 'medium',
        metadata: {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeRarity: badge.rarity,
          badgeImage: badge.imageUrl,
        },
      },
    })

    awarded.push({
      id: badge.id,
      name: badge.name,
      rarity: badge.rarity,
      imageUrl: badge.imageUrl,
      triggerType: badge.triggerType as SystemBadgeTriggerType,
      triggerValue: badge.triggerValue as number,
    })
  }

  return awarded
}
