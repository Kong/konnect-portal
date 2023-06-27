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
      } else if (Array.isArray(message)) {
        return message[0].toUpperCase() + message.slice(1)
      } else {
        return message
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

    const errorMsg = error?.response?.data || {}
    if (errorMsg && errorMsg.title.includes('disabled')) {
      return 'Your account is pending approval for access'
    }
  }
}

export default handleKongAuthElementsError
