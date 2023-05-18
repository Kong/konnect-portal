module.exports = {
  extends: [
    '.client.eslintrc.js',
    'plugin:portal-vue/all'
  ],
  rules: {
    'no-console': ['error', { allow: ['error'] }],
    'portal-vue/vue-setup-context': 'error',
    'vue/multi-word-component-names': 'off',
    // Temporary rule that need to be resolved and turned back into errors
    'vue/no-reserved-component-names': 'off'
  }
}
