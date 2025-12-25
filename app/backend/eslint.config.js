import baseConfig from '@hono/eslint-config'

export default [
  ...baseConfig,
  {
    ignores: ['./eslint.config.js', './prettier.config.js', './generated/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
]
