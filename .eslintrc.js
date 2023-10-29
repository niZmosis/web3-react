/* eslint-env node */

require('@uniswap/eslint-config/load')

module.exports = {
  extends: ['@uniswap/eslint-config/react'],
  root: true,
  rules: {
    'import/no-unused-modules': 'off',
  },
}
