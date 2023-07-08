/** @type {import('eslint').Linter.Config} */

module.exports = {
  extends: ['eslint/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
};
