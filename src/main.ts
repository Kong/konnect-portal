import { createApp } from 'vue'
import piniaInstance, { useAppStore } from '@/stores'

import App from './App.vue'

import { portalRouter } from './router'
import { removeQueryParam } from './router/route-utils'

import useLaunchDarkly from '@/composables/useLaunchDarkly'

import { authApi, authApiBaseUrl, session } from '@/services'

// Import kong-auth-elements, styles, and options interface
import { KongAuthElementsPlugin } from '@kong/kong-auth-elements/dist/kong-auth-elements.es'
import '@kong/kong-auth-elements/dist/style.css'
import handleKongAuthElementsError from '@/helpers/handleKongAuthElementsError'

// Globally import all Kongponents
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

import './assets/utilities.scss'
import './main.css'

// Globally defined components
import { registerComponents } from './components/registerComponents'
import CopyUuid, { CopyUuidNotifyParam } from '@kong-ui-public/copy-uuid'
import '@kong-ui-public/copy-uuid/dist/style.css'
import useToaster from './composables/useToaster'
import usePortalApi from './hooks/usePortalApi'
import { createRedirectHandler } from './helpers/auth'

/**
 * Initialize application
 */

async function init () {
  const app = createApp(App)

  // Initialize the Pinia store
  app.use(piniaInstance)

  const router = portalRouter()

  const { setPortalData, setSession, logout } = useAppStore()

  authApi.setAuthErrorCallback(createRedirectHandler(router, logout))

  app.use(Kongponents)

  registerComponents(app)

  const { portalApiV2 } = usePortalApi()

  try {
    const portalContext = await portalApiV2.value.service.portalApi.getPortalContext()

    const {
      portal_id: portalId,
      org_id: orgId,
      featureset_id: featuresetId,
      feature_set: featureSet,
      oidc_auth_enabled: oidcAuthEnabled,
      is_public: isPublic,
      basic_auth_enabled: basicAuthEnabled,
      rbac_enabled: isRbacEnabled,
      allowed_time_period: allowedTimePeriod
    } = portalContext.data

    if (isPublic === false) {
      portalApiV2.value.updateClientWithCredentials()
    }

    const authClientConfig = { basicAuthEnabled, oidcAuthEnabled }

    setPortalData({ portalId, orgId, authClientConfig, featuresetId, featureSet, isPublic, isRbacEnabled, allowedTimePeriod })
    setSession(session)

    // Fetch session data from localStorage
    await session.saveData(session.checkLocalDataForUser())

    const { initialize: initLaunchDarkly } = useLaunchDarkly()

    await initLaunchDarkly()

    if (!isPublic) {
      if (session.authenticatedWithIdp()) {
        let res

        try {
          res = await portalApiV2.value.service.developerApi.getDeveloperMe()
        } catch (e) {
        // // catch error to prevent going directly to global api error handler
          res = { data: undefined }
          // remove loginSuccess to adjust session check
          removeQueryParam('loginSuccess')
        }

        await session.saveData({
          ...session.data,
          developer: res.data
        })
      }
    }

    app.use(router)

    // Register the kong-auth-elements Vue plugin
    app.use(KongAuthElementsPlugin, {
      apiBaseUrl: authApiBaseUrl,
      userEntity: 'developer',
      shadowDom: false,
      customErrorHandler: handleKongAuthElementsError,
      developerConfig: {
        portalId
      }
    })

    app.use(CopyUuid, {
      notify: (props: CopyUuidNotifyParam) => {
        useToaster().notify({
          appearance: props.type === 'error' ? 'danger' : 'success',
          message: props.message
        })
      }
    })

    app.mount('#app')
  } catch (error) {
    // This logic ensures that if the portalaccesstoken is invalid
    // a user will not get stuck on the loading screen
    if (error?.response?.status === 401 && window.location.hostname.includes('localhost')) {
      document.cookie = `portalaccesstoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`
      session.destroy()
      window.location.reload()
    }
  }
}

init()
