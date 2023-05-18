import { useAppStore } from '@/stores'
import { session } from '@/services'
import { storeToRefs } from 'pinia'

const enableLD = import.meta.env.VITE_ENABLE_LAUNCH_DARKLY === 'true'

let ld

async function loadDeps () {
  if (enableLD) {
    try {
      const modules = import.meta.glob('/node_modules/launchdarkly-js-client-sdk/dist/*es.js')
      if (modules) {
        ld = await Object.values(modules)[0]()
      }
    } catch (e) {
      // ignore failure to import as it's an optional dependency
    }
  }
}

loadDeps()

let ldClient

export default function useLaunchDarkly () {
  const appStore = useAppStore()
  const { featuresetId, portalId, orgId } = storeToRefs(appStore)

  const initialize = async () => {
    if (!enableLD) {
      return
    }

    ldClient = ld.initialize(
      featuresetId.value,
      getUser(),
      { bootstrap: 'localStorage' }
    )

    await ldClient.waitUntilReady()
  }

  /**
   * Returns an LDUser object for either the active user, or an anonymous user if no session exists
   * @returns {LDUser}
   */
  const getUser = () => {
    let ldUser
    if (session.exists()) {
      ldUser = {
        key: session.data?.developer?.id,
        anonymous: false,
        custom: {
          portalId: portalId.value,
          orgId: orgId.value
        }
      }
    } else {
      ldUser = {
        // Use a shared key so this does not count against our MAUs
        // https://docs.launchdarkly.com/home/users/anonymous-users/?q=anonymous#tracking-anonymous-users-with-a-shared-key
        key: 'ANONYMOUS_USER',
        custom: { orgId: orgId.value, portalId: portalId.value }
      }
    }

    return ldUser
  }

  return {
    initialize,
    ldClient
  }
}
