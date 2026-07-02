import type { ActivityType } from '~/types/activity.types'
import { normalizeLegacyActivityType, validateActivityType } from '~/types/activity.types'

interface Activity {
  id: string
  type: string
  timestamp: Date | string
  avatar?: string
  username?: string
  teacherName?: string
  enigmaTitle?: string
  enigmaXp?: number
  missionTitle?: string
  missionXp?: number
  newLevel?: number
  className?: string
  achievementName?: string
  badgeName?: string
  badgeImage?: string
  xpAmount?: number
  source?: string
  classId?: string
  studentId?: string
  metadata?: Record<string, unknown> | null
}

export type ResourceKind = 'xp' | 'coin' | 'mana' | 'life'

export interface ResourceDelta {
  kind: ResourceKind
  amount: number // valor absoluto
  positive: boolean // true → suma, false → resta
}

interface FormattedActivity {
  id: string
  username?: string
  studentId?: string
  description: string
  timeAgo: string
  avatar?: string
  badge?: {
    type: 'xp' | 'new' | 'level' | 'mission' | 'achievement' | 'behavior'
    text: string
    image?: string
    /** Para 'behavior': true = positivo (pulgar arriba), false = negativo (pulgar abajo). */
    positive?: boolean
  }
  /** Chips visuales de recursos involucrados (XP, monedas, maná, vidas). */
  resources?: ResourceDelta[]
}

/** Construye un ResourceDelta a partir de un delta firmado (positivo o negativo). */
function makeDelta(kind: ResourceKind, value: number | undefined | null): ResourceDelta | null {
  if (!value) return null
  return { kind, amount: Math.abs(value), positive: value > 0 }
}

/**
 * Format activities for display
 * @param perspective - 'student' for 2nd person (Tu...), 'teacher' for 3rd person (El estudiante...)
 */
export function useActivityFormatter(perspective: 'student' | 'teacher' = 'student') {
  const formatTimeAgo = (timestamp: Date | string): string => {
    const now = new Date()
    const activityDate = new Date(timestamp)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return '< 1m'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  const formatActivities = (activities: Activity[]): FormattedActivity[] => {
    return activities
      .map((activity): FormattedActivity | null => {
        const normalizedType = normalizeLegacyActivityType(activity.type as string) as ActivityType

        // Validate in development
        if (import.meta.env.DEV) {
          validateActivityType(normalizedType, `activity-formatter-${perspective}`)
        }

        let description = ''
        let badge:
          | {
              type: 'xp' | 'new' | 'level' | 'mission' | 'achievement' | 'behavior'
              text: string
              image?: string
              positive?: boolean
            }
          | undefined
        let resources: ResourceDelta[] | undefined

        // Format based on perspective
        const isTeacher = perspective === 'teacher'

        switch (normalizedType) {
          case 'enigma_completed':
            if (isTeacher) {
              description = `${activity.teacherName || 'El profesor'} aprobó su entrega de <strong>"${activity.enigmaTitle}"</strong>`
            } else {
              description = `${activity.teacherName || 'El profesor'} aprobó tu entrega de <strong>"${activity.enigmaTitle}"</strong>`
            }
            badge = { type: 'xp', text: `+${activity.enigmaXp} XP` }
            break

          case 'enigma_submitted':
            description = isTeacher
              ? `Envió <strong>"${activity.enigmaTitle}"</strong> a revisión`
              : `Entregaste <strong>"${activity.enigmaTitle}"</strong>`
            // No badge for submissions (only when approved)
            badge = undefined
            break

          case 'mission_completed':
            description = isTeacher
              ? `Completó la misión <strong>"${activity.missionTitle}"</strong>`
              : `Completaste la misión <strong>"${activity.missionTitle}"</strong>`
            badge = activity.missionXp
              ? { type: 'mission', text: `+${activity.missionXp} XP` }
              : undefined
            break

          case 'level_up':
            description = isTeacher
              ? `Subió al nivel <strong>${activity.newLevel}</strong>`
              : `Subiste al nivel <strong>${activity.newLevel}</strong>`
            badge = { type: 'level', text: `Nivel ${activity.newLevel}` }
            break

          case 'class_joined':
            description = isTeacher
              ? `Se unió a <strong>"${activity.className || 'una clase'}"</strong>`
              : `Te uniste a <strong>"${activity.className || 'una clase'}"</strong>`
            badge = { type: 'new', text: 'Nueva' }
            break

          case 'achievement_unlocked':
            description = isTeacher
              ? `Desbloqueó el logro <strong>"${activity.achievementName}"</strong>`
              : `Desbloqueaste el logro <strong>"${activity.achievementName}"</strong>`
            badge = { type: 'achievement', text: 'Logro' }
            break

          case 'badge_unlocked':
            description = isTeacher
              ? `Desbloqueó la insignia <strong>"${activity.badgeName}"</strong>`
              : `Desbloqueaste la insignia <strong>"${activity.badgeName}"</strong>`
            badge = {
              type: 'achievement',
              text: activity.badgeName || '',
              image: activity.badgeImage,
            }
            break

          case 'xp_gained':
            if (activity.xpAmount != null && activity.xpAmount > 0) {
              description = isTeacher
                ? `Ganó <strong>+${activity.xpAmount} XP</strong> en ${activity.source || 'una actividad'}`
                : `Ganaste <strong>+${activity.xpAmount} XP</strong> en ${activity.source || 'una actividad'}`
              badge = { type: 'xp', text: `+${activity.xpAmount} XP` }
            } else {
              // Skip activities with no real XP
              return null
            }
            break

          case 'student_enrolled':
            description = isTeacher
              ? `Se registró en la plataforma`
              : `Te registraste en la plataforma`
            badge = { type: 'new', text: 'Bienvenido' }
            break

          case 'progress_milestone':
            description = isTeacher
              ? activity.source || 'Alcanzó un hito de progreso'
              : activity.source || 'Alcanzaste un hito de progreso'
            badge = { type: 'achievement', text: 'Hito' }
            break

          case 'behavior_applied': {
            const meta = (activity.metadata || {}) as {
              kind?: 'positive' | 'negative'
              xpDelta?: number
              coinDelta?: number
              lifeDelta?: number
            }
            const name = activity.source || 'un comportamiento'
            description = isTeacher
              ? `Recibió el comportamiento <strong>"${name}"</strong>`
              : `Recibiste el comportamiento <strong>"${name}"</strong>`
            resources = [
              makeDelta('xp', meta.xpDelta),
              makeDelta('coin', meta.coinDelta),
              makeDelta('life', meta.lifeDelta),
            ].filter((r): r is ResourceDelta => r !== null)
            // Propagamos el tipo (positivo/negativo) al badge para que el
            // frontend pueda elegir icono pulgar arriba/abajo.
            badge = {
              type: 'behavior',
              text: name,
              positive: meta.kind !== 'negative',
            }
            break
          }

          case 'shop_purchased': {
            const meta = (activity.metadata || {}) as { price?: number }
            const name = activity.source || 'un artículo'
            description = isTeacher
              ? `Compró <strong>"${name}"</strong> en la tienda`
              : `Compraste <strong>"${name}"</strong> en la tienda`
            // El precio sale de monedas, así que va firmado en negativo.
            resources = [makeDelta('coin', meta.price != null ? -meta.price : 0)].filter(
              (r): r is ResourceDelta => r !== null
            )
            badge = undefined
            break
          }

          case 'shop_item_used': {
            const meta = (activity.metadata || {}) as { manaCost?: number; lifeRestore?: number }
            const name = activity.source || 'un artículo'
            description = isTeacher
              ? `Usó <strong>"${name}"</strong>`
              : `Usaste <strong>"${name}"</strong>`
            resources = [
              // El maná se gasta (negativo), las vidas se recuperan (positivo).
              makeDelta('mana', meta.manaCost ? -meta.manaCost : 0),
              makeDelta('life', meta.lifeRestore),
            ].filter((r): r is ResourceDelta => r !== null)
            badge = undefined
            break
          }

          default:
            console.error(`[ActivityFormatter] Unknown activity type:`, {
              type: activity.type,
              normalizedType,
              perspective,
              activity,
            })
            description = 'Actividad reciente'
        }

        return {
          id: activity.id,
          username: isTeacher ? activity.username : undefined,
          studentId: activity.studentId,
          description,
          timeAgo: formatTimeAgo(activity.timestamp),
          avatar: activity.avatar || '/app/avatars/atenea.svg',
          badge,
          resources: resources?.length ? resources : undefined,
        }
      })
      .filter((a): a is FormattedActivity => a !== null)
  }

  return {
    formatActivities,
    formatTimeAgo,
  }
}
