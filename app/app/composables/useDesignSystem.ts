import { designTokens } from '~/utils/designTokens'

/**
 * useDesignSystem Composable
 *
 * Proporciona acceso centralizado al sistema de diseño en componentes Vue.
 *
 * @example
 * ```vue
 * <script setup>
 * const { colors, spacing, typography } = useDesignSystem()
 *
 * // Usar en computed, methods, etc.
 * const buttonColor = colors.primary.default
 * const cardPadding = spacing.md
 * </script>
 * ```
 */

export function useDesignSystem() {
  /**
   * Obtiene un color CSS del sistema
   * @param path - Ruta del color (ej: 'primary.default', 'text.secondary')
   * @returns El valor del color o undefined si no existe
   */
  function getColor(path: string): string | undefined {
    const keys = path.split('.')
    let value: any = designTokens.colors

    for (const key of keys) {
      value = value?.[key]
    }

    return typeof value === 'string' ? value : undefined
  }

  /**
   * Obtiene un valor de spacing CSS del sistema
   * @param size - Tamaño del spacing ('xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl')
   * @returns El valor del spacing
   */
  function getSpacing(size: keyof typeof designTokens.spacing): string {
    return designTokens.spacing[size]
  }

  /**
   * Obtiene un valor de border radius CSS del sistema
   * @param size - Tamaño del radius ('none', 'sm', 'md', 'lg', 'xl', '2xl', 'full')
   * @returns El valor del border radius
   */
  function getBorderRadius(size: keyof typeof designTokens.borderRadius): string {
    return designTokens.borderRadius[size]
  }

  /**
   * Obtiene un shadow CSS del sistema
   * @param size - Tamaño del shadow ('sm', 'md', 'lg', 'xl', '2xl', 'inner')
   * @returns El valor del shadow
   */
  function getShadow(size: keyof typeof designTokens.shadows): string {
    return designTokens.shadows[size]
  }

  /**
   * Obtiene un breakpoint del sistema
   * @param size - Tamaño del breakpoint ('sm', 'md', 'lg', 'xl', '2xl')
   * @returns El valor del breakpoint
   */
  function getBreakpoint(size: keyof typeof designTokens.breakpoints): string {
    return designTokens.breakpoints[size]
  }

  /**
   * Genera una transición CSS completa
   * @param properties - Propiedades CSS a animar (ej: 'all', 'color', 'opacity')
   * @param duration - Duración ('fast', 'base', 'slow')
   * @param timing - Función de tiempo ('easeInOut', 'easeIn', 'easeOut', 'linear')
   * @returns String de transición CSS
   */
  function createTransition(
    properties: string | string[] = 'all',
    duration: keyof typeof designTokens.transitions.duration = 'base',
    timing: keyof typeof designTokens.transitions.timing = 'easeInOut'
  ): string {
    const props = Array.isArray(properties) ? properties.join(', ') : properties
    const durationValue = designTokens.transitions.duration[duration]
    const timingValue = designTokens.transitions.timing[timing]

    return `${props} ${durationValue} ${timingValue}`
  }

  /**
   * Genera un media query para un breakpoint
   * @param size - Tamaño del breakpoint
   * @param content - CSS content string
   * @returns Media query string
   */
  function mediaQuery(size: keyof typeof designTokens.breakpoints, content: string): string {
    return `@media (min-width: ${getBreakpoint(size)}) { ${content} }`
  }

  /**
   * Convierte un color hex a RGB
   * @param hex - Color en formato hex (ej: '#7C3AED')
   * @returns String RGB (ej: '124, 58, 237')
   */
  function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0, 0, 0'

    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)

    return `${r}, ${g}, ${b}`
  }

  /**
   * Genera un color con opacidad
   * @param hex - Color hex
   * @param opacity - Opacidad (0-1)
   * @returns Color rgba
   */
  function withOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex)
    return `rgba(${rgb}, ${opacity})`
  }

  // Exponer todo el sistema de diseño
  return {
    // Design tokens completos
    ...designTokens,

    // Helper functions
    getColor,
    getSpacing,
    getBorderRadius,
    getShadow,
    getBreakpoint,
    createTransition,
    mediaQuery,
    hexToRgb,
    withOpacity,
  }
}

/**
 * Composable para acceder a clases de Tailwind CSS generadas dinámicamente
 *
 * @example
 * ```vue
 * <script setup>
 * const { getButtonClasses, getCardClasses } = useTailwindClasses()
 *
 * const buttonClass = getButtonClasses('primary', 'md')
 * </script>
 * ```
 */
export function useTailwindClasses() {
  /**
   * Genera clases de Tailwind para botones
   */
  function getButtonClasses(
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md'
  ): string {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary: 'bg-primary text-text-inverse hover:bg-primary-hover focus:ring-primary',
      secondary: 'bg-secondary text-text-inverse hover:bg-secondary-hover focus:ring-secondary',
      outline: 'border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary',
      ghost: 'text-primary hover:bg-primary-light focus:ring-primary',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
    }

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
  }

  /**
   * Genera clases de Tailwind para cards
   */
  function getCardClasses(
    variant: 'default' | 'hover' | 'flat' = 'default',
    padding: 'none' | 'sm' | 'md' | 'lg' = 'md'
  ): string {
    const baseClasses = 'bg-surface rounded-xl'

    const variantClasses = {
      default: 'border border-border-primary shadow-md',
      hover:
        'border border-border-primary shadow-md transition-all duration-200 hover:shadow-lg hover:border-border-secondary cursor-pointer',
      flat: 'border-0',
    }

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]}`
  }

  /**
   * Genera clases de Tailwind para inputs
   */
  function getInputClasses(hasError = false): string {
    const baseClasses =
      'w-full px-4 py-2 bg-surface border rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-bg-tertiary disabled:cursor-not-allowed'

    const stateClasses = hasError
      ? 'border-error focus:ring-error focus:border-transparent'
      : 'border-border-primary focus:ring-primary focus:border-transparent'

    return `${baseClasses} ${stateClasses}`
  }

  /**
   * Genera clases de Tailwind para badges
   */
  function getBadgeClasses(
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md'
  ): string {
    const baseClasses = 'inline-flex items-center font-medium rounded-full'

    const variantClasses = {
      primary: 'bg-primary-light text-primary',
      secondary: 'bg-secondary-light text-secondary',
      success: 'bg-success-light text-success-dark',
      warning: 'bg-warning-light text-warning-dark',
      error: 'bg-error-light text-error-dark',
      info: 'bg-info-light text-info-dark',
    }

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    }

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
  }

  return {
    getButtonClasses,
    getCardClasses,
    getInputClasses,
    getBadgeClasses,
  }
}
