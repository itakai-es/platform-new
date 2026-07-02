/**
 * ITAKAI Class Gamification Types
 * Types for class-specific XP/Level system
 *
 * Each student has independent XP and level per class,
 * enabling competition within each class context.
 */

/**
 * Gamification data for a specific class
 * Returned by GET /students/classes/:classId/gamification
 */
export interface ClassGamificationData {
  classId: string
  xp: number
  level: number
  title: string
  nextTitle?: string // Title for next level (only if different from current)
  name?: string // Student's real name
  username?: string // Student's class-specific nickname
  avatar?: string // Student's class-specific avatar
  guideId?: string // Student's selected guide for this class
  progress: number // 0-100 progress within current level
  currentXP: number // XP accumulated within current level
  requiredXP: number // XP needed to reach next level
  rank: number // Position in class ranking
  totalStudents: number // Total students in class
}

/**
 * Data for level-up event within a class
 */
export interface ClassLevelUpData {
  classId: string
  className: string
  oldLevel: number
  newLevel: number
  xpGained: number
  newTitle: string
}

/**
 * API response for class gamification endpoint
 */
export interface ClassGamificationResponse {
  gamification: ClassGamificationData
}
