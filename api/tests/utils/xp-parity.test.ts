import { describe, it, expect } from 'vitest'
import {
  getLevelFromXP as backendGetLevelFromXP,
  getLevelInfo as backendGetLevelInfo,
  getXPForLevel as backendGetXPForLevel,
  getTotalXPForLevel as backendGetTotalXPForLevel,
  LEVEL_CAP as backendLevelCap,
} from '../../src/utils/xp-calculator.js'

// Import the FRONTEND module directly. Both files are framework-free pure TS
// modules; pulling them in here gives us a compile-time + runtime contract
// that the two implementations never drift.
import {
  getLevelFromXP as frontGetLevelFromXP,
  getLevelInfo as frontGetLevelInfo,
  getXPForLevel as frontGetXPForLevel,
  getTotalXPForLevel as frontGetTotalXPForLevel,
} from '../../../app/app/utils/xp-calculator.js'
import { LEVEL_CAP as frontLevelCap } from '../../../app/app/utils/gamification-config.js'

describe('XP parity — backend vs frontend', () => {
  it('LEVEL_CAP matches', () => {
    expect(frontLevelCap).toBe(backendLevelCap)
  })

  it('getXPForLevel matches across the full curve', () => {
    for (let level = 1; level <= backendLevelCap + 5; level++) {
      expect(frontGetXPForLevel(level)).toBe(backendGetXPForLevel(level))
    }
  })

  it('getTotalXPForLevel matches for every level 1..CAP', () => {
    for (let level = 0; level <= backendLevelCap; level++) {
      expect(frontGetTotalXPForLevel(level)).toBe(backendGetTotalXPForLevel(level))
    }
  })

  const XP_SAMPLES = [
    0, 1, 49, 50, 51, 100, 172, 173, 381, 500, 683, 684, 999, 1000, 1500, 2499,
    2500, 2501, 5000, 9999, 10000, 25000, 50000, 100000, 500000, 999999999,
  ]

  for (const xp of XP_SAMPLES) {
    it(`getLevelFromXP(${xp}) agrees`, () => {
      expect(frontGetLevelFromXP(xp)).toBe(backendGetLevelFromXP(xp))
    })

    it(`getLevelInfo(${xp}) agrees on level/progress/currentXP/requiredXP`, () => {
      const front = frontGetLevelInfo(xp)
      const back = backendGetLevelInfo(xp)
      expect(front.level).toBe(back.level)
      expect(front.progress).toBe(back.progress)
      expect(front.currentXP).toBe(back.currentXP)
      expect(front.requiredXP).toBe(back.requiredXP)
      expect(front.title).toBe(back.title)
    })
  }

  it('getLevelInfo clamps negative XP identically', () => {
    const front = frontGetLevelInfo(-1000)
    const back = backendGetLevelInfo(-1000)
    expect(front.level).toBe(back.level)
    expect(front.totalXP).toBe(back.totalXP)
    expect(front.progress).toBe(back.progress)
  })

  it('getLevelInfo caps at LEVEL_CAP identically with extra XP', () => {
    const far = backendGetTotalXPForLevel(backendLevelCap) + 999999
    const front = frontGetLevelInfo(far)
    const back = backendGetLevelInfo(far)
    expect(front.level).toBe(backendLevelCap)
    expect(back.level).toBe(backendLevelCap)
    expect(front.progress).toBe(100)
    expect(back.progress).toBe(100)
    expect(front.requiredXP).toBe(0)
    expect(back.requiredXP).toBe(0)
  })
})
