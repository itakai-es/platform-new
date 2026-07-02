import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default createConfigForNuxt({
  features: {
    stylistic: false,
  },
})
  .prepend(eslint.configs.recommended)
  .append(prettier, {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/unified-signatures': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-case-declarations': 'warn',
      'no-async-promise-executor': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  })
  // Vue 3.5 parsea handlers single-line ("expr1; expr2") como una expresión
  // única; reformatearlos a multilínea rompe el dev server (ver 9cbac56 y
  // 3a952e4). Desactivamos Prettier dentro de .vue para preservar ese estilo
  // intencional. ESLint sigue activo para el resto de reglas.
  .append({
    files: ['**/*.vue'],
    rules: {
      'prettier/prettier': 'off',
    },
  })
