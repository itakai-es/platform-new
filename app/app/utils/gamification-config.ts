/**
 * Configuración centralizada del sistema de gamificación ITAKAI
 * Todas las constantes de XP, niveles, badges y achievements
 */

// ============================================
// SISTEMA DE XP Y NIVELES
// ============================================

/** XP base para el cálculo de niveles */
export const BASE_XP = 50

/** Exponente de la curva de progresión (suave) */
export const EXPONENT = 1.3

/** Nivel máximo alcanzable */
export const LEVEL_CAP = 50

// ============================================
// PRESETS DE XP PARA ENIGMAS
// ============================================

/** Presets disponibles para asignar XP a enigmas */
export const ENIGMA_XP_PRESETS = [20, 40, 60, 80, 100] as const

export type EnigmaXPPreset = (typeof ENIGMA_XP_PRESETS)[number]

/** Presets de maná que un enigma otorga al completarse (0 = no da maná). */
export const ENIGMA_MANA_PRESETS = [0, 10, 20, 30, 50] as const

export type EnigmaManaPreset = (typeof ENIGMA_MANA_PRESETS)[number]

/** Presets de monedas que un enigma otorga al completarse (los elige el profesor,
 *  independientes de la XP). */
export const ENIGMA_COIN_PRESETS = [20, 40, 60, 80, 100] as const

export type EnigmaCoinPreset = (typeof ENIGMA_COIN_PRESETS)[number]

/** Presets de precio (en monedas) para los artículos de la tienda. */
export const SHOP_PRICE_PRESETS = [100, 200, 400, 600, 1000] as const

/** Presets de coste en maná por uso para los poderes de la tienda. */
export const SHOP_MANA_PRESETS = [10, 20, 30, 40, 50] as const

/** Descripciones de cada preset */
export const ENIGMA_XP_DESCRIPTIONS: Record<EnigmaXPPreset, string> = {
  20: 'Mínima - Ejercicio breve, quiz rápido',
  40: 'Baja - Quiz simple, ejercicio básico',
  60: 'Media - Ejercicio práctico, análisis',
  80: 'Alta - Proyecto corto, ensayo',
  100: 'Máxima - Trabajo complejo, investigación',
}

// ============================================
// BONUS POR COMPLETAR MISIÓN
// ============================================

export type MissionRarity = 'comun' | 'rara' | 'epica' | 'legendaria'

/** Bonus de XP al completar una misión según su rareza */
export const MISSION_COMPLETION_BONUS: Record<MissionRarity, number> = {
  comun: 50,
  rara: 100,
  epica: 200,
  legendaria: 400,
}

// ============================================
// TÍTULOS POR NIVEL
// ============================================

export interface LevelTitle {
  minLevel: number
  maxLevel: number
  title: string
}

export const LEVEL_TITLES: LevelTitle[] = [
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
]

/**
 * Obtiene el título correspondiente a un nivel
 */
export function getTitleForLevel(level: number): string {
  const titleEntry = LEVEL_TITLES.find(t => level >= t.minLevel && level <= t.maxLevel)
  return titleEntry?.title ?? 'Mortal'
}

// ============================================
// BADGES AUTOMÁTICAS
// ============================================

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type BadgeCategory = 'missions' | 'xp' | 'level'

export interface SystemBadge {
  id: string
  name: string
  description: string
  category: BadgeCategory
  rarity: BadgeRarity
  trigger: {
    type: 'missions_completed' | 'xp_total' | 'level_reached'
    value: number
  }
  imageUrl?: string
}

export const SYSTEM_BADGES: SystemBadge[] = [
  // Por misiones completadas
  {
    id: 'templo-heroe',
    name: 'Templo del Héroe',
    description: 'Completa tu primera misión',
    category: 'missions',
    rarity: 'common',
    trigger: { type: 'missions_completed', value: 1 },
  },
  {
    id: 'guerrero-bronce',
    name: 'Guerrero de Bronce',
    description: 'Completa 10 misiones',
    category: 'missions',
    rarity: 'common',
    trigger: { type: 'missions_completed', value: 10 },
  },
  {
    id: 'guerrero-plata',
    name: 'Guerrero de Plata',
    description: 'Completa 25 misiones',
    category: 'missions',
    rarity: 'rare',
    trigger: { type: 'missions_completed', value: 25 },
  },
  {
    id: 'guerrero-oro',
    name: 'Guerrero de Oro',
    description: 'Completa 50 misiones',
    category: 'missions',
    rarity: 'epic',
    trigger: { type: 'missions_completed', value: 50 },
  },
  {
    id: 'campeon-olimpico',
    name: 'Campeón Olímpico',
    description: 'Completa 100 misiones',
    category: 'missions',
    rarity: 'legendary',
    trigger: { type: 'missions_completed', value: 100 },
  },
  // Por XP total
  {
    id: 'ambrosia-novato',
    name: 'Ambrosía del Novato',
    description: 'Alcanza 500 XP',
    category: 'xp',
    rarity: 'common',
    trigger: { type: 'xp_total', value: 500 },
  },
  {
    id: 'nectar-progreso',
    name: 'Néctar de Progreso',
    description: 'Alcanza 2,500 XP',
    category: 'xp',
    rarity: 'rare',
    trigger: { type: 'xp_total', value: 2500 },
  },
  {
    id: 'tridente-poseidon',
    name: 'Tridente de Poseidón',
    description: 'Alcanza 10,000 XP',
    category: 'xp',
    rarity: 'epic',
    trigger: { type: 'xp_total', value: 10000 },
  },
  {
    id: 'rayo-zeus',
    name: 'Rayo de Zeus',
    description: 'Alcanza 50,000 XP',
    category: 'xp',
    rarity: 'legendary',
    trigger: { type: 'xp_total', value: 50000 },
  },
  // Por nivel alcanzado
  {
    id: 'iniciado',
    name: 'Iniciado',
    description: 'Alcanza el nivel 5',
    category: 'level',
    rarity: 'common',
    trigger: { type: 'level_reached', value: 5 },
  },
  {
    id: 'corona-laurel',
    name: 'Corona de Laurel',
    description: 'Alcanza el nivel 15',
    category: 'level',
    rarity: 'rare',
    trigger: { type: 'level_reached', value: 15 },
  },
  {
    id: 'manto-hera',
    name: 'Manto de Hera',
    description: 'Alcanza el nivel 30',
    category: 'level',
    rarity: 'epic',
    trigger: { type: 'level_reached', value: 30 },
  },
  {
    id: 'trono-olimpo',
    name: 'Trono del Olimpo',
    description: 'Alcanza el nivel 50',
    category: 'level',
    rarity: 'legendary',
    trigger: { type: 'level_reached', value: 50 },
  },
]

// ============================================
// ACHIEVEMENTS
// ============================================

export type AchievementType = 'incremental' | 'one_time'
export type AchievementCategory = 'missions' | 'xp' | 'exploration'

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  type: AchievementType
  targetValue: number
  rewardXP: number
  rarity: BadgeRarity
}

export const ACHIEVEMENTS: Achievement[] = [
  // Por misiones
  {
    id: 'primera-mision',
    name: 'Primera Misión',
    description: 'Completa tu primera misión',
    category: 'missions',
    type: 'one_time',
    targetValue: 1,
    rewardXP: 50,
    rarity: 'common',
  },
  {
    id: 'aprendiz-dedicado',
    name: 'Aprendiz Dedicado',
    description: 'Completa 10 misiones',
    category: 'missions',
    type: 'incremental',
    targetValue: 10,
    rewardXP: 150,
    rarity: 'common',
  },
  {
    id: 'maestro-misiones',
    name: 'Maestro de Misiones',
    description: 'Completa 25 misiones',
    category: 'missions',
    type: 'incremental',
    targetValue: 25,
    rewardXP: 300,
    rarity: 'rare',
  },
  {
    id: 'heroe-incansable',
    name: 'Héroe Incansable',
    description: 'Completa 50 misiones',
    category: 'missions',
    type: 'incremental',
    targetValue: 50,
    rewardXP: 500,
    rarity: 'epic',
  },
  {
    id: 'leyenda-olimpica',
    name: 'Leyenda Olímpica',
    description: 'Completa 100 misiones',
    category: 'missions',
    type: 'incremental',
    targetValue: 100,
    rewardXP: 1000,
    rarity: 'legendary',
  },
  {
    id: 'perfeccionista',
    name: 'Perfeccionista',
    description: 'Completa 5 misiones con puntuación perfecta',
    category: 'missions',
    type: 'incremental',
    targetValue: 5,
    rewardXP: 200,
    rarity: 'rare',
  },
  // Por XP
  {
    id: 'recolector-xp',
    name: 'Recolector XP',
    description: 'Alcanza 500 XP',
    category: 'xp',
    type: 'incremental',
    targetValue: 500,
    rewardXP: 50,
    rarity: 'common',
  },
  {
    id: 'acumulador-xp',
    name: 'Acumulador XP',
    description: 'Alcanza 2,500 XP',
    category: 'xp',
    type: 'incremental',
    targetValue: 2500,
    rewardXP: 150,
    rarity: 'rare',
  },
  {
    id: 'experto-xp',
    name: 'Experto XP',
    description: 'Alcanza 10,000 XP',
    category: 'xp',
    type: 'incremental',
    targetValue: 10000,
    rewardXP: 400,
    rarity: 'epic',
  },
  // Por exploración
  {
    id: 'explorador',
    name: 'Explorador',
    description: 'Únete a 3 clases diferentes',
    category: 'exploration',
    type: 'incremental',
    targetValue: 3,
    rewardXP: 100,
    rarity: 'common',
  },
]

// ============================================
// COLORES POR RAREZA
// ============================================

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#9CA3AF', // Gris
  rare: '#4A9EFF', // Azul
  epic: '#AC74FD', // Púrpura
  legendary: '#FFC338', // Oro
}
