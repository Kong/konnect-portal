import { authApi } from '@/services'

/**
 * @typedef {Object} SessionUser
 * @property {UUID} id
 * @property {string} email
 * @property {UUID} portal_id
 * @property {string} expiration_date
 */

/**
 * @typedef {Object} SessionData
 * @optional @property {SessionUser} developer
 * @optional @property {string} to - path to previous route
 * @optional @property {Date} expires
 */

export default class SessionCookie {
  /**
   * @property {SessionData} data
   * @property {string} sessionName
   * @property {KongAuthApi} kongAuthApi
   */

  data: Record<string, any>

  sessionName: string

  isLoggingOut = false

  SESSION_NAME_COOKIE = 'konnect_portal_session'

  // Only for e2e tests. This should never be set/used for an actual user.
  CYPRESS_USER_SESSION_EXISTS = 'CYPRESS_USER_SESSION_EXISTS'

  constructor (sessionName: string) {
    this.data = {}
    this.sessionName = sessionName || this.SESSION_NAME_COOKIE
  }

  encode (data: Record<string, any>) {
    try {
      return window.btoa(encodeURIComponent(JSON.stringify(data)))
    } catch (e) {
      if (!data.developer) {
        // this means session invalided
        // do not console any error.
        return
      }

      // eslint-disable-next-line no-console
      console.error('Failed to encode session')
    }
  }

  decode (encodedJson: string) {
    return JSON.parse(decodeURIComponent(window.atob(encodedJson)))
  }

  checkLocalDataForUser () {
    const sessionDataRaw = localStorage.getItem(this.sessionName) || this.encode(this.data)

    try {
      this.data = this.decode(sessionDataRaw)

      return this.data
    } catch (_) {
      // eslint-disable-next-line no-console
      console.error('Failed to validate session')
      this.saveData({})
    }

    return {}
  }

  async saveData (data: Record<string, any>, force = true) {
    this.data = data

    const sessionExists = this.exists()
    // only set the session to local if specifying to force save,
    // or if the session doesn't exist and force is false.
    if (force || (!force && !sessionExists)) {
      localStorage.setItem(this.sessionName, this.encode(this.data))
    }
  }

  getUser () {
    const { developer } = this.checkLocalDataForUser()

    return {
      email: developer?.email,
      id: developer?.id
    }
  }

  async destroy (to?: string) {
    if (this.isLoggingOut) {
      return
    }

    this.isLoggingOut = true

    try {
      if (!to) {
        this.data = {}
        localStorage.removeItem(this.sessionName)
      } else {
        this.saveData({ to }, true)
      }

      // Check for IdP single logout URL via kauth endpoint
      await authApi.authenticationV2.logout()

      // Otherwise, build a new URL from the root
      const logoutUrl = new URL(`${window.location.origin}/login`)

      return logoutUrl.href
    } catch (err) {
      this.data = {}
      localStorage.removeItem(this.sessionName)

      // Return to login page
      return `${window.location.origin}/login`
    } finally {
      this.isLoggingOut = false
    }
  }

  authenticatedWithIdp () {
    let devAuthenticatedWithIdp = false

    try {
      // Get URL search params
      const urlSearchParams = window && (new URL(window.location.href)).searchParams

      devAuthenticatedWithIdp = urlSearchParams.get('loginSuccess') === 'true'
    } catch (_) {
      // Fallback to this.data.developer.id exists
      devAuthenticatedWithIdp = !!this.data.developer?.id
    }

    return devAuthenticatedWithIdp
  }

  exists () {
    // Return true if the session.data.developer.id has a value
    //
    // We also return true here for a cookie value so that Cypress tests do not automatically get logged out. This should never be set for an actual user.

    return !!this.data.developer?.id || this.authenticatedWithIdp() || !!this.getCookieValue(this.CYPRESS_USER_SESSION_EXISTS)
  }

  async refreshToken () {
    // Trigger auth refresh
    try {
      // Trigger auth refresh
      const response = await authApi.authenticationV2.refresh()

      if (response.status === 200) {
        // refresh data
        this.saveData(this.checkLocalDataForUser())

        // Successful refresh, session did not expire
        return false
      }
    } catch (err) {
      // Not reachable as kongAuthApi.authentication.refresh() call
      // is silently failing on 401 response and its not catched - so the behavior was reimplemented in
      // interceptor of KongAuthApi
      return true
    }
  }

  getCookieValue = (name) => (
    document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || ''
  )
}
