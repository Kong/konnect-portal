// Add allowed CSS custom property prefixes here as needed from the Appearance API
const allowedCssCustomPropertyPattern = '^(kui-|portal-ui-|font-|kong-ui-|text_colors-|button_colors-|section_colors-).+$'
const allowedCssCustomPropertyMessage = "Expected custom property \"%s\" to be sourced from @kong/design-tokens with prefix '--kui-' or to have one of the following prefixes: '--kong-ui-', '--text_colors', '--button_colors', '--section_colors', '--portal-ui', '--font'"

module.exports = {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  plugins: [
    'stylelint-order',
    '@kong/design-tokens/stylelint-plugin'
  ],
  ignoreFiles: [
    'cypress/**/*',
    'dist/**/*',
  ],
  rules: {
    'order/properties-alphabetical-order': true,
    '@kong/design-tokens/use-proper-token': true,
    // Only allow @kong/design-tokens or `--kong-ui-*` CSS custom properties
    'custom-property-pattern': [
      allowedCssCustomPropertyPattern,
      {
        message: allowedCssCustomPropertyMessage,
        severity: 'error'
      }
    ],
    'custom-property-no-missing-var-function': true,
    // Disable the following rules
    'no-descending-specificity': null,
  },
  overrides: [
    // TODO: Remove this override and enable the rule above when all Kongponents utility classes and CSS custom properties have been removed
    {
      files: [
        // TODO: Add directories here once the utility classes and CSS custom properties have been removed
        // './src/components/ApiDocumentation/**/*',
      ],
      rules: {
        'custom-property-pattern': [
          allowedCssCustomPropertyPattern,
          {
            message: allowedCssCustomPropertyMessage,
            severity: 'error'
          }
        ],
      }
    }
  ]
}
