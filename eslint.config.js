const { FlatCompat } = require('@eslint/eslintrc');
const { configs } = require('eslint-plugin-prettier');
const compat = new FlatCompat({
  recommendedConfig: configs.recommended,
});

module.exports = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  ...compat.extends(
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ),
];
