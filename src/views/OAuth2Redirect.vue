<template>
  <KSkeleton
    :rows="5"
    :columns="5"
    :width="100"
    :height="20"
  />
</template>

<script lang="ts" setup>
import { useI18nStore } from '@/stores'
import { onMounted } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'

interface OAuth2 {
  state: string;
  redirectUrl: string;
  auth: {
    name: string;
    schema: Map<string, string>;
    code?: string;
  };
  callback: Function;
  errCb: Function;
}

const helpText = useI18nStore().state.helpText.oauth2
const route = useRoute()

const parseRouteData = (routeData: string | LocationQuery): Record<string, string> => {
  if (!routeData) return {}

  // handle locationQuery
  if (typeof routeData === 'object') {
    // decode any URI components:
    const routeDataDecoded = Object.keys(routeData).reduce((acc, key) => {
      acc[key] = decodeURIComponent((routeData[key] && routeData[key].toString()) || '')

      return acc
    }, {})

    return routeDataDecoded
  }

  const data = routeData.startsWith('#') ? routeData.substring(1) : routeData
  const pairs = data.split('&')
  const result = {}

  pairs.forEach(pair => {
    const [key, value] = pair.split('=')

    result[key] = decodeURIComponent(value || '')
  })

  return result
}

const handleOAuthRedirect = () => {
  const oauth2 = window.opener ? (window.opener as any).swaggerUIRedirectOauth2 as OAuth2 : null
  if (!oauth2) {
    console.error(helpText.dataNotFound)

    return
  }

  const sentState = oauth2.state
  const redirectUrl = oauth2.redirectUrl
  const params = {
    ...parseRouteData(route.query),
    ...parseRouteData(route.hash)
  }
  const isValid = params.state === sentState

  if (isAuthorizationCodeFlow(oauth2) && !oauth2.auth.code) {
    if (!isValid) {
      reportError(oauth2, helpText.authMaybeUnsafe, 'warning')
    }

    if (params.code) {
      delete oauth2.state
      oauth2.auth.code = params.code.toString()
      oauth2.callback({ auth: oauth2.auth, redirectUrl })
    } else {
      reportError(oauth2, helpText.defaultError, 'error', params)
    }
  } else {
    oauth2.callback({ auth: oauth2.auth, token: params, isValid, redirectUrl })
  }

  window.close()
}

const isAuthorizationCodeFlow = (oauth2: OAuth2): boolean => {
  const flow = oauth2.auth.schema.get('flow')

  return flow === 'accessCode' || flow === 'authorizationCode' || flow === 'authorization_code'
}

const reportError = (oauth2: OAuth2, message: string, level: string, errorParams: Record<string, string> = {}): void => {
  const error = {
    authId: oauth2.auth.name,
    source: 'auth',
    level,
    message
  }

  if (errorParams.error) {
    error.message += ` [${errorParams.error}]: ${errorParams.error_description || helpText.noDescription} ${errorParams.error_uri ? helpText.moreInfo + errorParams.error_uri : ''}`
  }

  oauth2.errCb(error)
}

onMounted(() => {
  handleOAuthRedirect()
})

</script>
