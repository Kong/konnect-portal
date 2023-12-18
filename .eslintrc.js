const deprecatedUtilityClasses = require('./deprecated-utility-classes')

module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  globals: {
    analytics: 'readonly',
    konnect: 'readonly',
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript',
    'plugin:portal-vue/all',
  ],
  rules: {
    'vue/no-bare-strings-in-template': ['error'],
    'arrow-parens': 'off',
    'space-before-function-paren': 'off',
    'generator-star-spacing': 'off',
    'object-property-newline': 'error',
    'lines-between-class-members': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['block', 'block-like'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var', 'if'],
      },
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive',
      },
    ],
    curly: 'error',
    camelcase: 'off',
    indent: 'off',
    semi: ['error', 'never'],
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': 'error',
    'no-mixed-operators': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/custom-event-name-casing': 'off',
    'vue/html-indent': 'error',
    'array-bracket-spacing': ['error', 'never', {
      singleValue: false,
      objectsInArrays: false,
    }],
    'object-curly-spacing': ['error', 'always', {
      arraysInObjects: true,
      objectsInObjects: true,
    }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    'no-trailing-spaces': 'error',
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      ignores: ['CodeContent', 'pre', 'textarea', 'a'],
    }],
    'vue/attributes-order': ['error', {
      alphabetical: true,
    }],
    'portal-vue/vue-setup-context': 'error',
    'vue/multi-word-component-names': 'off',
    // Disallow Kongponents utility classes
    // TODO: Enable this rule when we remove all Kongponents utility classes
    // 'vue/no-restricted-class': ['error', ...deprecatedUtilityClasses],
    // Temporary rule that need to be resolved and turned back into errors
    'vue/no-reserved-component-names': 'off',
  },
  overrides: [
    // TODO: Remove this override and enable the rule above when all directories remove all Kongponents utility classes
    {
      files: [
        // TODO: Add directories here once the utility classes have been removed
        './src/fake-components/**/*', // TODO: This file array cannot be empty, so please replace with a valid path as you go
      ],
      rules: {
        'vue/no-restricted-class': ['error', ...deprecatedUtilityClasses],
      },
    },
  ],
}
