import AuthApiService from '@/services/AuthApiService'
import SessionCookie from '@/services/SessionCookie'
import PortalV2ApiService from '@/services/PortalV2ApiService'

export const baseUrl = import.meta.env.DEV || window.location.hostname.includes('localhost') ? '/' : import.meta.env.VITE_PORTAL_API_URL

const strippedTrailingSlashAuthApiUrl = import.meta.env.VITE_PORTAL_API_URL.endsWith('/') ? import.meta.env.VITE_PORTAL_API_URL.slice(0, -1) : import.meta.env.VITE_PORTAL_API_URL

export const authApiBaseUrl = import.meta.env.DEV || window.location.hostname.includes('localhost') ? window.location.origin : strippedTrailingSlashAuthApiUrl

export const portalApiV2 = new PortalV2ApiService(baseUrl)

export const authApi = new AuthApiService(authApiBaseUrl)

export const session = new SessionCookie('konnect_portal_session')

// Provide session to Konnect API and KAuth API instance
authApi.setSession(session)
portalApiV2.setSession(session)
