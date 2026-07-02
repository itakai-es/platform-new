/**
 * Avatar Utilities
 * Sistema de avatars por defecto usando los avatars temáticos del proyecto
 */

// Avatars disponibles en /public/app/avatars/
const DEFAULT_AVATARS = [
  '/app/avatars/atenea.svg',
  '/app/avatars/odiseo.svg',
  '/app/avatars/penelope.svg',
  '/app/avatars/polifemo.svg',
  '/app/avatars/poseidon.svg',
]

/**
 * Genera un hash numérico simple a partir de un string
 * Usado para asignar avatars de forma determinista
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Retorna un avatar por defecto basado en el userId
 * El mismo userId siempre retornará el mismo avatar
 */
export function getDefaultAvatar(userId: string): string {
  const hash = simpleHash(userId)
  const index = hash % DEFAULT_AVATARS.length
  return DEFAULT_AVATARS[index]
}

/**
 * Retorna la URL del avatar del usuario
 * Si el usuario no tiene avatar, retorna uno por defecto
 */
export function getAvatarUrl(user: { id?: string; avatar?: string | null }): string {
  // Si tiene avatar, retornarlo
  if (user.avatar) {
    return user.avatar
  }

  // Si no tiene id, usar un avatar por defecto
  if (!user.id) {
    return DEFAULT_AVATARS[0]
  }

  // Generar avatar basado en el id
  return getDefaultAvatar(user.id)
}

/**
 * Exportar lista de avatars disponibles
 * Útil para selectores de avatar en onboarding
 */
export { DEFAULT_AVATARS }
