/**
 * ITAKAI Design Tokens
 *
 * Tokens de diseño centralizados exportables como TypeScript.
 * Sincronizado con app/assets/css/tailwind.css
 *
 * IMPORTANTE: Estos valores deben coincidir con las CSS variables.
 * Modificar aquí Y en tailwind.css para mantener sincronía.
 */

/* ============================================
   COLORES
   ============================================ */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F5',
  },

  // Surface (cards, containers)
  surface: {
    default: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E9ECEF',
  },

  // Text
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6C757D',
    muted: '#ADB5BD',
    inverse: '#FFFFFF',
  },

  // Brand colors (placeholder - reemplazar con diseño del diseñador)
  primary: {
    default: '#7C3AED',
    hover: '#6D28D9',
    active: '#5B21B6',
    light: '#EDE9FE',
  },

  secondary: {
    default: '#10B981',
    hover: '#059669',
    active: '#047857',
    light: '#D1FAE5',
  },

  accent: {
    default: '#F59E0B',
    hover: '#D97706',
    active: '#B45309',
    light: '#FEF3C7',
  },

  // Semantic colors
  success: {
    default: '#10B981',
    light: '#D1FAE5',
    dark: '#047857',
  },

  warning: {
    default: '#F59E0B',
    light: '#FEF3C7',
    dark: '#B45309',
  },

  error: {
    default: '#EF4444',
    light: '#FEE2E2',
    dark: '#B91C1C',
  },

  info: {
    default: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1D4ED8',
  },

  // Borders
  border: {
    primary: '#E5E7EB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
  },
} as const

/* ============================================
   TIPOGRAFÍA
   ============================================ */

export const typography = {
  // Font Families
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
    display: "'Inter', system-ui, sans-serif",
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const

/* ============================================
   SPACING
   ============================================ */

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const

/* ============================================
   BORDER RADIUS
   ============================================ */

export const borderRadius = {
  none: '0',
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const

/* ============================================
   SHADOWS
   ============================================ */

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

/* ============================================
   TRANSITIONS
   ============================================ */

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  timing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    linear: 'linear',
  },
} as const

/* ============================================
   Z-INDEX
   ============================================ */

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const

/* ============================================
   BREAKPOINTS (Responsive)
   ============================================ */

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/* ============================================
   DESIGN SYSTEM COMPLETO
   Exportación unificada
   ============================================ */

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
} as const

/* ============================================
   TYPES - Para autocompletado y type safety
   ============================================ */

export type Color = typeof colors
export type Typography = typeof typography
export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Breakpoints = typeof breakpoints
export type DesignTokens = typeof designTokens
