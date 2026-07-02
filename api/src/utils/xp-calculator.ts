// XP and Level calculation utilities for ITAKAI gamification

export const BASE_XP = 50
export const EXPONENT = 1.3
export const LEVEL_CAP = 50

export const ENIGMA_XP_PRESETS = [20, 40, 60, 80, 100] as const

export const MISSION_COMPLETION_BONUS = {
  comun: 50,
  rara: 100,
  epica: 200,
  legendaria: 400,
} as const

export const LEVEL_TITLES = [
  { minLevel: 1, maxLevel: 4, title: 'Mortal' },
  { minLevel: 5, maxLevel: 9, title: 'Héroe Novato' },
  { minLevel: 10, maxLevel: 14, title: 'Héroe de Bronce' },
  { minLevel: 15, maxLevel: 19, title: 'Héroe de Plata' },
  { minLevel: 20, maxLevel: 24, title: 'Héroe de Oro' },
  { minLevel: 25, maxLevel: 29, title: 'Semidiós' },
  { minLevel: 30, maxLevel: 34, title: 'Titán' },
  { minLevel: 35, maxLevel: 39, title: 'Olímpico Menor' },
  { minLevel: 40, maxLevel: 44, title: 'Olímpico Mayor' },
  { minLevel: 45, maxLevel: 49, title: 'Avatar Divino' },
  { minLevel: 50, maxLevel: 50, title: 'Dios del Olimpo' },
] as const

/**
 * Calculate XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  return Math.floor(BASE_XP * Math.pow(level, EXPONENT))
}

/**
 * Calculate total XP required to REACH a level (cumulative threshold)
 * Level 1 starts at 0 XP, level 2 requires completing level 1's XP, etc.
 */
export function getTotalXPForLevel(level: number): number {
  if (level <= 1) return 0 // Level 1 starts at 0 XP
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i)
  }
  return total
}

/**
 * Calculate level from total XP.
 * Level 1: 0-49 XP, Level 2: 50-172 XP, etc. Capped at LEVEL_CAP.
 */
export function getLevelFromXP(totalXP: number): number {
  if (totalXP <= 0) return 1
  let level = 1
  let xpThreshold = 0

  while (level < LEVEL_CAP) {
    const xpForNextLevel = getXPForLevel(level)
    if (xpThreshold + xpForNextLevel > totalXP) {
      break
    }
    xpThreshold += xpForNextLevel
    level++
  }

  return level
}

/**
 * Get complete level information from total XP.
 * At LEVEL_CAP, progress stays at 100%.
 */
export function getLevelInfo(totalXP: number) {
  const safeXP = Math.max(0, totalXP)
  const level = getLevelFromXP(safeXP)
  const currentLevelXP = getTotalXPForLevel(level)

  if (level >= LEVEL_CAP) {
    return {
      level: LEVEL_CAP,
      title: getTitleForLevel(LEVEL_CAP),
      progress: 100,
      currentXP: 0,
      requiredXP: 0,
      totalXP: safeXP,
    }
  }

  const requiredXP = getXPForLevel(level)
  const xpInCurrentLevel = safeXP - currentLevelXP
  const progress = requiredXP > 0
    ? Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / requiredXP) * 100)))
    : 0

  return {
    level,
    title: getTitleForLevel(level),
    progress,
    currentXP: xpInCurrentLevel,
    requiredXP,
    totalXP: safeXP,
  }
}

/**
 * Get title for a specific level
 */
export function getTitleForLevel(level: number): string {
  const entry = LEVEL_TITLES.find((t) => level >= t.minLevel && level <= t.maxLevel)
  return entry?.title ?? 'Mortal'
}

/**
 * Check if completing an enigma/mission would cause a level up
 */
export function wouldLevelUp(currentXP: number, xpToAdd: number): boolean {
  const currentLevel = getLevelFromXP(currentXP)
  const newLevel = getLevelFromXP(currentXP + xpToAdd)
  return newLevel > currentLevel
}

/**
 * Get XP reward for mission completion based on rarity
 */
export function getMissionCompletionRewards(rarity: keyof typeof MISSION_COMPLETION_BONUS) {
  return {
    xp: MISSION_COMPLETION_BONUS[rarity] || MISSION_COMPLETION_BONUS.comun,
  }
}

/**
 * Calculate total XP for a mission: rarity bonus + sum of enigma XP
 */
export function calculateMissionTotalXP(rarity: string, enigmaXPs: number[]): number {
  const bonus = MISSION_COMPLETION_BONUS[rarity as keyof typeof MISSION_COMPLETION_BONUS] || MISSION_COMPLETION_BONUS.comun
  return bonus + enigmaXPs.reduce((sum, xp) => sum + xp, 0)
}

/**
 * Validate a custom XP override for an enigma. Teachers can award any integer
 * between 0 and the enigma's base XP (partial credit), so percentage shortcuts
 * (25%, 50%, 75%, 100%) work for any preset value.
 */
export function validateCustomEnigmaXp(value: number | undefined | null, fallback: number): number {
  if (value === undefined || value === null) return fallback
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error('El XP personalizado debe ser un número entero')
  }
  if (value < 0) {
    throw new Error('El XP personalizado no puede ser negativo')
  }
  if (value > fallback) {
    throw new Error(`El XP personalizado no puede superar el XP base del enigma (${fallback})`)
  }
  return value
}

