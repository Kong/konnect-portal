module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  globals: {
    analytics: 'readonly',
    konnect: 'readonly'
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    "vue/no-bare-strings-in-template": ["error"],
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    'object-property-newline': 'error',
    'lines-between-class-members': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['block', 'block-like'],
        next: '*'
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return'
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*'
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var', 'if']
      },
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*'
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive'
      }
    ],
    curly: 'error',
    camelcase: 'off',
    'eol-last': 'error',
    'no-mixed-operators': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/custom-event-name-casing': 'off',
    'vue/html-indent': 'error',
    'no-trailing-spaces': 'error',
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      ignores: ['CodeContent', 'pre', 'textarea', 'a']
    }]
  },
  overrides: [
  ]
}
