// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
  },
  {
    rules: {
      'pnpm/json-enforce-catalog': 'off',
      'no-console': 'off', // CLI apps need console output
    },
  },
)
