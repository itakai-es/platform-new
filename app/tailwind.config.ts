import type { Config } from 'tailwindcss'

/**
 * ITAKAI Tailwind Configuration
 *
 * Sistema de diseño centralizado usando CSS Variables.
 * Cualquier cambio en app/assets/css/tailwind.css se reflejará aquí.
 *
 * IMPORTANTE: Todos los paths usan 'app/' debido a srcDir configurado en nuxt.config.ts
 */

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],

  theme: {
    extend: {
      /* ============================================
         RESPONSIVE BREAKPOINTS
         ============================================ */
      screens: {
        xs: '475px', // Móvil grande (iPhone 12/13 Pro)
        sm: '640px', // Tablet pequeña
        md: '768px', // Tablet
        lg: '1024px', // Desktop
        xl: '1280px', // Desktop grande
        '2xl': '1536px', // Desktop XL
        '3xl': '1800px', // Desktop XXL (para layouts complejos como el podio horizontal)
      },

      /* ============================================
         COLORES - Usando CSS Variables
         ============================================ */
      colors: {
        // Backgrounds
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },

        // Surface (cards, containers)
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
        },

        // Text
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },

        // Brand colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          light: 'var(--color-primary-light)',
        },

        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          active: 'var(--color-secondary-active)',
          light: 'var(--color-secondary-light)',
        },

        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          active: 'var(--color-accent-active)',
          light: 'var(--color-accent-light)',
        },

        // Semantic colors
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },

        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },

        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },

        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          dark: 'var(--color-info-dark)',
        },

        // Borders
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          tertiary: 'var(--color-border-tertiary)',
        },

        // Badges - Status & State Colors
        badge: {
          urgente: 'var(--color-badge-urgente)',
          activa: 'var(--color-badge-activa)',
          pendiente: 'var(--color-badge-pendiente)',
          bloqueada: 'var(--color-badge-bloqueada)',
          epica: 'var(--color-badge-epica)',
          rara: 'var(--color-badge-rara)',
          'text-light': 'var(--color-badge-text-light)',
          'text-dark': 'var(--color-badge-text-dark)',
        },

        /* ============================================
           ITAKAI BRAND COLORS - Official Palette
           ============================================ */

        // Navy 700 - Text, Headers, Primary Buttons
        navy: {
          DEFAULT: 'var(--color-primary)',
          base: 'var(--color-navy-base)', // #03003C - Login hero bg
          'base-light': 'var(--color-navy-base-light)', // #0a0a52 - Onda
          700: 'var(--color-navy-700)',
          dark: 'var(--color-navy-700-hover)',
          darker: 'var(--color-navy-700-active)',
        },

        // Purple Brand - Accent, Buttons, Labels
        purple: {
          DEFAULT: 'var(--color-purple)',
          hover: 'var(--color-purple-hover)',
          active: 'var(--color-purple-active)',
          light: 'var(--color-purple-light)',
          dark: 'var(--color-purple-dark)', // #5a3a8d - Social buttons
          'dark-hover': 'var(--color-purple-dark-hover)',
          'dark-active': 'var(--color-purple-dark-active)',
        },

        // Lilac Panel - Login Panels, Light Surfaces
        lilac: {
          DEFAULT: 'var(--color-lilac)',
          hover: 'var(--color-lilac-hover)',
          active: 'var(--color-lilac-active)',
        },

        // Yellow Brand - AI Success, Chips, CTAs
        yellow: {
          DEFAULT: 'var(--color-yellow)',
          hover: 'var(--color-yellow-hover)',
          active: 'var(--color-yellow-active)',
          light: 'var(--color-yellow-light)',
          dark: 'var(--color-yellow-dark)',
        },

        // Mint Brand - Positive States, Success
        mint: {
          DEFAULT: 'var(--color-mint)',
          hover: 'var(--color-mint-hover)',
          active: 'var(--color-mint-active)',
          light: 'var(--color-mint-light)',
        },

        // Peach Brand - KPI/Fechas Cards
        peach: {
          DEFAULT: 'var(--color-peach)',
          hover: 'var(--color-peach-hover)',
          active: 'var(--color-peach-active)',
          light: 'var(--color-peach-light)',
        },

        // Sky Blue Brand - Stats Cards, Info
        sky: {
          DEFAULT: 'var(--color-sky)',
          hover: 'var(--color-sky-hover)',
          active: 'var(--color-sky-active)',
          light: 'var(--color-sky-light)',
          'light-alt': 'var(--color-sky-light-alt)',
        },

        // Green Brand - Active States, Success Vivid
        green: {
          DEFAULT: 'var(--color-green)',
          light: 'var(--color-green-light)',
        },

        // Red/Pink Brand - Urgent Badges, Errors
        red: {
          DEFAULT: 'var(--color-red)',
          hover: 'var(--color-red-hover)',
          active: 'var(--color-red-active)',
          light: 'var(--color-red-light)',
          'light-alt': 'var(--color-red-light-alt)',
        },
      },

      /* ============================================
         TIPOGRAFÍA
         ============================================ */
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
        display: 'var(--font-display)',
      },

      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-body)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
        // Heading Sizes - Design System 2.0
        h1: [
          'var(--text-h1)',
          {
            lineHeight: 'var(--leading-h1)',
            letterSpacing: 'var(--tracking-tighter)',
            fontWeight: 'var(--font-bold)',
          },
        ],
        h2: [
          'var(--text-h2)',
          {
            lineHeight: 'var(--leading-h2)',
            letterSpacing: 'var(--tracking-tight)',
            fontWeight: 'var(--font-bold)',
          },
        ],
        h3: [
          'var(--text-h3)',
          {
            lineHeight: 'var(--leading-h3)',
            letterSpacing: 'var(--tracking-normal)',
            fontWeight: 'var(--font-semibold)',
          },
        ],
        h4: [
          'var(--text-h4)',
          {
            lineHeight: 'var(--leading-h4)',
            letterSpacing: 'var(--tracking-normal)',
            fontWeight: 'var(--font-semibold)',
          },
        ],
      },

      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        extrabold: 'var(--font-extrabold)',
      },

      lineHeight: {
        none: 'var(--leading-none)',
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
        loose: 'var(--leading-loose)',
      },

      /* Letter Spacing (Tracking) - Design System 2.0 */
      letterSpacing: {
        tighter: 'var(--tracking-tighter)', // -0.5% para H1
        tight: 'var(--tracking-tight)', // -0.25% para H2
        normal: 'var(--tracking-normal)', // 0% para H3/H4
      },

      /* ============================================
         SPACING
         ============================================ */
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },

      /* ============================================
         CUSTOM WIDTH/HEIGHT - Avatar Sizes
         ============================================ */
      width: {
        9: '36px', // Avatar xs
        15: '60px', // Avatar md
        26: '104px', // Avatar lg
      },

      height: {
        9: '36px', // Avatar xs
        15: '60px', // Avatar md
        26: '104px', // Avatar lg
      },

      /* ============================================
         BORDER RADIUS
         ============================================ */
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },

      /* ============================================
         SHADOWS
         ============================================ */
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },

      /* ============================================
         TRANSITIONS
         ============================================ */
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
      },

      /* ============================================
         Z-INDEX
         ============================================ */
      zIndex: {
        base: '0',
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        'modal-backdrop': '1300',
        modal: '1400',
        popover: '1500',
        tooltip: '1600',
      },

      /* ============================================
         ANIMATIONS
         ============================================ */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 200ms ease-in-out',
        'fade-out': 'fade-out 200ms ease-in-out',
        'slide-in-up': 'slide-in-up 200ms ease-out',
        'slide-in-down': 'slide-in-down 200ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
      },

      /* ============================================
         TYPOGRAPHY PLUGIN - prose styles
         ============================================ */
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#23245D',
            '--tw-prose-headings': '#23245D',
            '--tw-prose-lead': '#23245D',
            '--tw-prose-links': '#ac74fd',
            '--tw-prose-bold': '#23245D',
            '--tw-prose-counters': '#ac74fd',
            '--tw-prose-bullets': '#ac74fd',
            '--tw-prose-hr': '#E6E3E5',
            '--tw-prose-quotes': '#23245D',
            '--tw-prose-quote-borders': '#ac74fd',
            '--tw-prose-code': '#ac74fd',
            '--tw-prose-th-borders': '#E6E3E5',
            '--tw-prose-td-borders': '#E6E3E5',
            maxWidth: 'none',
            // Explicit list styles (Tailwind preflight resets these, :where() in prose has 0 specificity)
            ul: { listStyleType: 'disc', paddingLeft: '1.25em' },
            ol: { listStyleType: 'decimal', paddingLeft: '1.25em' },
            'ul > li::marker': { color: 'var(--tw-prose-bullets)' },
            'ol > li::marker': { color: 'var(--tw-prose-counters)' },
          },
        },
      },
    },
  },

  plugins: [
    // Plugins se agregarán después de npm install
    // require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config
