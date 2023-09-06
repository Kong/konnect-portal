import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'
import SessionCookie from './SessionCookie'

export default class KongAuthApi {
  authErrorCallback: (error: AxiosError) => void

  baseUrl: string

  failedQueue = []

  session: SessionCookie

  client: AxiosInstance

  authenticationV2: {
    logout(): Promise<AxiosResponse<void>>
    refresh(): Promise<AxiosResponse<void>>
  }

  public setAuthErrorCallback (authErrorCallback?: (error: AxiosError) => void) {
    this.authErrorCallback = authErrorCallback
  }

  constructor (baseUrl?: string) {
    this.baseUrl = baseUrl

    this.authErrorCallback = () => false

    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        accept: 'application/json'
      }
    })

    this.client.interceptors.response.use(res => res, (originalErr) => {
      if (originalErr.response) {
        const appStore = useAppStore()
        const { authTokenIsRefreshing } = storeToRefs(appStore)

        const originalRequest = originalErr.config

        // Try to refresh the token once and then retry requests if successful
        if (originalErr.response.status === 401 && !originalRequest._retry) {
          // If the original request is to refresh the auth token, and the request has failed, do not retry requests
          // It is directly done there, as in SessionCookie this.kongAuthApi.authentication.refresh() call
          // is silently failing on 401 response and its not possible to rely on code there
          if (originalRequest.url.includes('/developer/refresh')) {
            // Refresh token was invalid, so don't retry requests
            authTokenIsRefreshing.value = false
            // Clear the queue
            this.processQueue(false)
            // Call error handler
            this.authErrorCallback(originalErr)

            return Promise.reject(originalErr)
          }

          // If there is already a refresh in progress, add pending requests to queue
          if (authTokenIsRefreshing.value) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(
              // Refresh success, so retry requests
              () => this.client(originalRequest)
            ).catch(() => {
              // Refresh failed, do not retry requests
              return Promise.reject(originalErr)
            })
          }

          originalRequest._retry = true
          authTokenIsRefreshing.value = true

          return new Promise((resolve, reject) => {
            const sessionDoesExist = this.session.exists()

            // If session does not exist its not worth to even try to refresh
            if (!sessionDoesExist) {
              if (this.authErrorCallback) {
                this.authErrorCallback(originalErr)
              }

              authTokenIsRefreshing.value = false

              return reject(originalErr)
            }

            // Try refreshing
            this.session.refreshToken().then((sessionIsExpired) => {
              if (sessionIsExpired) {
                // Session is expired, so don't retry requests
                this.processQueue(false)

                this.authErrorCallback(originalErr)

                reject(originalErr)
              } else {
                // Session was refreshed, so do retry requests
                this.processQueue(true)
                resolve(this.client(originalRequest))
              }
            }).finally(() => {
              authTokenIsRefreshing.value = false
            })
          })
        }

        if (originalErr.response.status === 403) {
          this.authErrorCallback(originalErr)
        }
      }

      return Promise.reject(originalErr)
    })

    this.authenticationV2 = {
      logout: async () => this.client.post(this.baseUrl + '/api/v2/developer/logout'),
      refresh: async () => this.client.post(this.baseUrl + '/api/v2/developer/refresh')
    }
  }

  processQueue (shouldProceed = true) {
    this.failedQueue.forEach(promise => {
      if (shouldProceed) {
        promise.resolve()
      } else {
        promise.reject()
      }
    })

    this.failedQueue = []
  }

  // Allow passing in the session inside /client/src/main.ts once created
  setSession (session) {
    this.session = session
  }
}
