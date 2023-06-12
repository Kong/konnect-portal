import AuthApiService from '@/services/AuthApiService'
import SessionCookie from '@/services/SessionCookie'
import PortalV2ApiService from '@/services/PortalV2ApiService'

/*
 * Set the base path for the KAuth API.
 * Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to
 * properly resolve within container applications, especially when called from nested routes
 */

const kauthBaseUrl = import.meta.env.VITE_PORTAL_API_URL && import.meta.env.VITE_PORTAL_API_URL !== '/' ? import.meta.env.VITE_PORTAL_API_URL : window.location.origin

export const authApiBaseUrl = import.meta.env.DEV ? '/kauth' : new URL('/kauth', kauthBaseUrl).href

export const baseUrl = import.meta.env.DEV ? '/' : import.meta.env.VITE_PORTAL_API_URL

export const portalApiV2 = new PortalV2ApiService(baseUrl)

export const authApi = new AuthApiService(authApiBaseUrl)

export const session = new SessionCookie('konnect_portal_session')

// Provide session to Konnect API and KAuth API instance
authApi.setSession(session)
portalApiV2.setSession(session)
