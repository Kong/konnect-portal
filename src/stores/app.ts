import SessionCookie from '@/services/SessionCookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PortalTimeframeKeys } from '@/types/vitals'

interface PortalData {
  portalId: string;
  orgId: string;
  authClientConfig: {
    basicAuthEnabled: boolean;
    oidcAuthEnabled: boolean;
  };
  featuresetId: string;
  featureSet: string;
  isPublic: boolean;
  isRbacEnabled: boolean;
  allowedTimePeriod: string;
}

export const useAppStore = defineStore('app', () => {
  const authTokenIsRefreshing = ref<boolean>(false)
  const isPublic = ref<boolean>(false)
  const isRbacEnabled = ref<boolean>(null)
  const globalLoading = ref<boolean>(false)
  const portalId = ref<string>(null)
  const orgId = ref<string>(null)
  const developerSession = ref<SessionCookie>(null)
  const featuresetId = ref<string>(null)
  const featureSet = ref<string>('')
  const allowedTimePeriod = ref<string>(PortalTimeframeKeys.ONE_DAY)
  const authClientConfig = ref<{
    basicAuthEnabled: boolean;
    oidcAuthEnabled: boolean;
  }>(null)
  const logout = async (fullPath?: string) => {
    return await developerSession.value.destroy(fullPath)
  }

  const setPortalData = (data: Partial<PortalData>) => {
    if (data.portalId) {
      portalId.value = data.portalId
    }

    if (data.orgId) {
      orgId.value = data.orgId
    }

    if (data.authClientConfig) {
      authClientConfig.value = data.authClientConfig
    }

    if (data.featuresetId) {
      featuresetId.value = data.featuresetId
    }

    if (data.featureSet) {
      featureSet.value = data.featureSet
    }

    if (data.isRbacEnabled) {
      isRbacEnabled.value = data.isRbacEnabled
    }

    if (data.isPublic) {
      isPublic.value = data.isPublic
    }

    if (data.allowedTimePeriod) {
      allowedTimePeriod.value = data.allowedTimePeriod
    }
  }

  const setSession = (session: SessionCookie) => {
    developerSession.value = session
  }

  return {
    authTokenIsRefreshing,
    isPublic,
    isRbacEnabled,
    globalLoading,
    portalId,
    orgId,
    developerSession,
    featuresetId,
    featureSet,
    allowedTimePeriod,
    authClientConfig,

    logout,
    setPortalData,
    setSession
  }
})
