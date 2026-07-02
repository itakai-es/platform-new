/**
 * XP Calculator — mirror of /data/itakai/api/src/utils/xp-calculator.ts.
 * MUST stay byte-for-byte identical with the backend to avoid level drift.
 */

import {
  BASE_XP,
  EXPONENT,
  LEVEL_CAP,
  getTitleForLevel,
  MISSION_COMPLETION_BONUS,
  type MissionRarity,
} from './gamification-config'

export interface LevelInfo {
  level: number
  currentXP: number
  requiredXP: number
  progress: number // 0-100
  title: string
  totalXP: number
}

/** XP needed to complete the given level (i.e. from this level to the next). */
export function getXPForLevel(level: number): number {
  return Math.floor(BASE_XP * Math.pow(level, EXPONENT))
}

/** Cumulative XP threshold required to have reached `level`. Level 1 starts at 0. */
export function getTotalXPForLevel(level: number): number {
  if (level <= 1) return 0
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i)
  }
  return total
}

/** Derive the student level from a total XP value. Capped at LEVEL_CAP. */
export function getLevelFromXP(totalXP: number): number {
  if (totalXP <= 0) return 1
  let level = 1
  let xpThreshold = 0

  while (level < LEVEL_CAP) {
    const xpForNextLevel = getXPForLevel(level)
    if (xpThreshold + xpForNextLevel > totalXP) break
    xpThreshold += xpForNextLevel
    level++
  }

  return level
}

/** Full level info used by the UI. At LEVEL_CAP, progress stays at 100%. */
export function getLevelInfo(totalXP: number): LevelInfo {
  const safeXP = Math.max(0, totalXP)
  const level = getLevelFromXP(safeXP)
  const currentLevelXP = getTotalXPForLevel(level)

  if (level >= LEVEL_CAP) {
    return {
      level: LEVEL_CAP,
      currentXP: 0,
      requiredXP: 0,
      progress: 100,
      title: getTitleForLevel(LEVEL_CAP),
      totalXP: safeXP,
    }
  }

  const requiredXP = getXPForLevel(level)
  const xpInCurrentLevel = safeXP - currentLevelXP
  const progress =
    requiredXP > 0
      ? Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / requiredXP) * 100)))
      : 0

  return {
    level,
    currentXP: xpInCurrentLevel,
    requiredXP,
    progress,
    title: getTitleForLevel(level),
    totalXP: safeXP,
  }
}

/** Number of levels gained between two XP snapshots (0 if none, can't be negative). */
export function checkLevelUp(oldXP: number, newXP: number): number {
  return Math.max(0, getLevelFromXP(newXP) - getLevelFromXP(oldXP))
}

/** Rarity bonus lookup. */
export function getMissionCompletionBonus(rarity: MissionRarity): number {
  return MISSION_COMPLETION_BONUS[rarity] ?? MISSION_COMPLETION_BONUS.comun
}

/** Enigmas XP + rarity bonus. */
export function calculateMissionXP(
  enigmasXP: number[],
  rarity: MissionRarity
): { enigmasTotal: number; bonus: number; total: number } {
  const enigmasTotal = enigmasXP.reduce((sum, xp) => sum + xp, 0)
  const bonus = getMissionCompletionBonus(rarity)
  return { enigmasTotal, bonus, total: enigmasTotal + bonus }
}

/** Milestone levels used for confetti/badge triggers. */
export function isLevelMilestone(level: number): boolean {
  return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].includes(level)
}
