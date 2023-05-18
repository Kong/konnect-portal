// Array of instances on the setup.root context we want to restrict importing
const setupContextBlockList = ['$router', '$route', '$store']

// Return a usage example for the ESLint error message
const getUsageExample = (propertyName) => {
  let example = ''
  const composableExample = (composableName) => 'Instead, create a variable from the composable within the setup() function: `const ' + propertyName + ' = composables.' + composableName + '()`'

  switch (propertyName) {
    case '$router':
      example = composableExample('useRouter')
      break
    case '$route':
      example = composableExample('useRoute')
      break
    case '$store':
      example = 'Instead, import the store singleton directly: `import store from \'@/store\'`'
      break
    case '$i18n':
      example = composableExample('useI18n')
      break
  }

  return example
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `The setup root context is deprecated and not available in Vue 3. Do not extract the following properties from the root context: "${setupContextBlockList.join(',')}"`,
      url: 'https://github.com/Kong/konnect-portal/blob/main/eslint-plugin-portal-vue/README.md#rules'
    },
    fixable: null
  },
  create (context) {
    return {
      Property (node) {
        if (Object.hasOwn(node, 'key') && node.key.type === 'Identifier' && node.key.name.toLowerCase() === 'root') {
          if (Object.hasOwn(node, 'value') && node.value.type === 'ObjectPattern') {
            node.value.properties.forEach((property) => {
              if (setupContextBlockList.includes(property.key.name)) {
                return context.report({
                  node,
                  loc: property.value.loc,
                  data: {
                    propertyName: property.key.name,
                    usageExample: getUsageExample(property.key.name)
                  },
                  message: 'Do not extract "{{ propertyName }}" from the setup root context as it is not available as of Vue 2.7. {{ usageExample }}'
                })
              }
            })
          }
        }

        return null
      }
    }
  }
}
