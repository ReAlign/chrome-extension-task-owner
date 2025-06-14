// @ts-check

import eslint from '@eslint/js'
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.git', 'node_modules', 'dist', 'eslint.config.js', '.storybook'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactRecommended,
  reactJsxRuntime,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // 'sort-imports': ['error'],
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/unbound-method': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)
