import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  missionCountMock: vi.fn(),
  enrollmentAggregateMock: vi.fn(),
  badgeFindManyMock: vi.fn(),
  studentBadgeCreateMock: vi.fn(),
  activityCreateMock: vi.fn(),
  notificationCreateMock: vi.fn(),
}))

vi.mock('../../src/config/database.js', () => ({
  prisma: {
    studentMissionProgress: { count: mocks.missionCountMock },
    classEnrollment: { aggregate: mocks.enrollmentAggregateMock },
    badge: { findMany: mocks.badgeFindManyMock },
    studentBadge: { create: mocks.studentBadgeCreateMock },
    activity: { create: mocks.activityCreateMock },
    notification: { create: mocks.notificationCreateMock },
  },
}))

import { awardSystemBadges } from '../../src/utils/system-badges.js'

const STUDENT = 'student-1'

beforeEach(() => {
  mocks.missionCountMock.mockReset().mockResolvedValue(0)
  mocks.enrollmentAggregateMock.mockReset().mockResolvedValue({ _max: { xp: 0, level: 1 } })
  mocks.badgeFindManyMock.mockReset().mockResolvedValue([])
  mocks.studentBadgeCreateMock.mockReset().mockResolvedValue({})
  mocks.activityCreateMock.mockReset().mockResolvedValue({})
  mocks.notificationCreateMock.mockReset().mockResolvedValue({})
})

describe('awardSystemBadges — no-op paths', () => {
  it('returns an empty list when the student is eligible for nothing', async () => {
    const result = await awardSystemBadges(STUDENT)
    expect(result).toEqual([])
    expect(mocks.studentBadgeCreateMock).not.toHaveBeenCalled()
    expect(mocks.activityCreateMock).not.toHaveBeenCalled()
    expect(mocks.notificationCreateMock).not.toHaveBeenCalled()
  })

  it('does not query again if findMany returns no eligible badges', async () => {
    mocks.missionCountMock.mockResolvedValue(5)
    mocks.enrollmentAggregateMock.mockResolvedValue({ _max: { xp: 200, level: 2 } })

    await awardSystemBadges(STUDENT)

    expect(mocks.badgeFindManyMock).toHaveBeenCalledTimes(1)
    expect(mocks.studentBadgeCreateMock).not.toHaveBeenCalled()
  })
})

describe('awardSystemBadges — eligibility query', () => {
  it('sends the student counters as the OR thresholds', async () => {
    mocks.missionCountMock.mockResolvedValue(12)
    mocks.enrollmentAggregateMock.mockResolvedValue({ _max: { xp: 750, level: 6 } })

    await awardSystemBadges(STUDENT)

    expect(mocks.badgeFindManyMock).toHaveBeenCalledWith({
      where: {
        teacherId: null,
        triggerType: { not: null },
        triggerValue: { not: null },
        OR: [
          { triggerType: 'missions_completed', triggerValue: { lte: 12 } },
          { triggerType: 'xp_total', triggerValue: { lte: 750 } },
          { triggerType: 'level_reached', triggerValue: { lte: 6 } },
        ],
        students: { none: { studentId: STUDENT } },
      },
    })
  })

  it('treats null aggregates (no enrollments) as 0 XP / level 1', async () => {
    mocks.enrollmentAggregateMock.mockResolvedValue({ _max: { xp: null, level: null } })

    await awardSystemBadges(STUDENT)

    const call = mocks.badgeFindManyMock.mock.calls[0][0]
    expect(call.where.OR).toEqual([
      { triggerType: 'missions_completed', triggerValue: { lte: 0 } },
      { triggerType: 'xp_total', triggerValue: { lte: 0 } },
      { triggerType: 'level_reached', triggerValue: { lte: 1 } },
    ])
  })
})

describe('awardSystemBadges — awarding', () => {
  const templo = {
    id: 'badge-templo',
    name: 'Templo del Héroe',
    rarity: 'common',
    imageUrl: '/badges/templo-heroe.svg',
    triggerType: 'missions_completed',
    triggerValue: 1,
  }
  const iniciado = {
    id: 'badge-iniciado',
    name: 'Iniciado',
    rarity: 'common',
    imageUrl: '/badges/iniciado.svg',
    triggerType: 'level_reached',
    triggerValue: 5,
  }

  it('inserts one student_badge, one activity and one notification per awarded badge', async () => {
    mocks.badgeFindManyMock.mockResolvedValue([templo])

    const result = await awardSystemBadges(STUDENT)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: templo.id, name: templo.name })

    expect(mocks.studentBadgeCreateMock).toHaveBeenCalledWith({
      data: { studentId: STUDENT, badgeId: templo.id },
    })
    expect(mocks.activityCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: STUDENT,
        type: 'badge_earned',
        badgeName: templo.name,
        badgeRarity: templo.rarity,
        badgeImage: templo.imageUrl,
      }),
    })
    expect(mocks.notificationCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: STUDENT,
        type: 'badge_earned',
        title: '¡Nueva insignia desbloqueada!',
        message: expect.stringContaining(templo.name),
        metadata: expect.objectContaining({ badgeId: templo.id }),
      }),
    })
  })

  it('awards multiple badges in a single call', async () => {
    mocks.badgeFindManyMock.mockResolvedValue([templo, iniciado])

    const result = await awardSystemBadges(STUDENT)

    expect(result).toHaveLength(2)
    expect(mocks.studentBadgeCreateMock).toHaveBeenCalledTimes(2)
    expect(mocks.activityCreateMock).toHaveBeenCalledTimes(2)
    expect(mocks.notificationCreateMock).toHaveBeenCalledTimes(2)
  })

  it('silently skips a badge if the studentBadge unique constraint races', async () => {
    mocks.badgeFindManyMock.mockResolvedValue([templo, iniciado])
    // First insert races and loses; second succeeds. The racing one must not
    // produce an activity or notification (those belong to the winning writer).
    mocks.studentBadgeCreateMock
      .mockRejectedValueOnce(new Error('Unique constraint failed'))
      .mockResolvedValueOnce({})

    const result = await awardSystemBadges(STUDENT)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(iniciado.id)
    expect(mocks.activityCreateMock).toHaveBeenCalledTimes(1)
    expect(mocks.notificationCreateMock).toHaveBeenCalledTimes(1)
  })
})

describe('awardSystemBadges — transactional client', () => {
  it('uses the passed tx client instead of the default prisma', async () => {
    const txMissionCount = vi.fn().mockResolvedValue(0)
    const txAggregate = vi.fn().mockResolvedValue({ _max: { xp: 0, level: 1 } })
    const txFindMany = vi.fn().mockResolvedValue([])
    const tx = {
      studentMissionProgress: { count: txMissionCount },
      classEnrollment: { aggregate: txAggregate },
      badge: { findMany: txFindMany },
      studentBadge: { create: vi.fn() },
      activity: { create: vi.fn() },
      notification: { create: vi.fn() },
    } as unknown as Parameters<typeof awardSystemBadges>[1]

    await awardSystemBadges(STUDENT, tx)

    expect(txMissionCount).toHaveBeenCalled()
    expect(txAggregate).toHaveBeenCalled()
    expect(txFindMany).toHaveBeenCalled()
    // The default prisma mocks must not be touched when a tx is passed.
    expect(mocks.missionCountMock).not.toHaveBeenCalled()
    expect(mocks.badgeFindManyMock).not.toHaveBeenCalled()
  })
})
