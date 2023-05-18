import { useI18nStore } from '@/stores'

function parseValidationErrors (error: Record<string, any>) {
  if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
    return error.response.data.message.reduce((messages, errorNode) => {
      messages.push(...parseValidationErrorNode(errorNode))

      return messages
    }, [])
  }

  return []
}

function parseValidationErrorNode (errorNode: Record<string, any>) {
  const helpText = useI18nStore().state.helpText

  const messages: any[] = []

  if (errorNode.constraints) {
    messages.push(...Object.entries(errorNode.constraints).map(([key, message]) => {
      const niceErrorMessage = helpText.validationErrors[key]
      if (niceErrorMessage) {
        return niceErrorMessage
      } else {
        // @ts-ignore
        return message[0].toUpperCase() + message.slice(1)
      }
    }))
  }

  if (errorNode.children) {
    messages.push(...errorNode.children.map(child => {
      return parseValidationErrorNode(child)
    }))
  }

  return messages
}

// extract errors from kong-auth-elements response
function handleKongAuthElementsError ({ error }) {
  if (!error) {
    return null
  } else {
    // handle validation errors separately from response errors
    const validationErrors = parseValidationErrors(error)
    if (validationErrors.length) {
      return validationErrors.join(', ')
    }

    const errors = error?.response?.data?.errors || []
    if (errors.length === 1) {
      const innerError = errors[0]

      switch (innerError.code) {
        case '1007':
          return 'Your account is pending approval for access'
        default:
          return null
      }
    } else {
      return null
    }
  }
}

export default handleKongAuthElementsError
