import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import { defineConfig } from "eslint/config";
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: { ...globals.browser }
    },
    plugins: {
      react,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'jsx-quotes': ['error', 'prefer-double'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'warn',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
          'pathGroups': [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '*.scss',
              group: 'index',
              patternOptions: { matchBase: true },
              position: 'after'
            }
          ]
        }
      ],
    },
    ignores: ['eslint.config.js'],
  },
])
