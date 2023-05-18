import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const ApiServiceAuthErrorReason = {
  NO_SESSION: 'NO_SESSION',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  RESPONSE_FORBIDDEN: 'RESPONSE_FORBIDDEN'
}

export default class ApiService {
  failedQueue: Array<any>

  authErrorCallback: (error: AxiosError) => void

  baseURL = null

  client: AxiosInstance

  session: any

  public setAuthErrorCallback (authErrorCallback?: (error: AxiosError) => void) {
    this.authErrorCallback = authErrorCallback
  }

  constructor (baseURL?: string) {
    this.baseURL = baseURL

    this.authErrorCallback = () => false

    this.client = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
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

            // If session does not exist it's not worth to even try to refresh
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

                if (this.authErrorCallback) {
                  this.authErrorCallback(originalErr)
                }

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

        if (originalErr.response.status === 403 && this.authErrorCallback) {
          this.authErrorCallback(originalErr)
        }
      }

      return Promise.reject(originalErr)
    })
  }

  updateClientWithCredentials () {
    this.client.defaults.withCredentials = true
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

  setSession (session) {
    this.session = session
  }

  getApiLink (path) {
    if (this.baseURL === '/') {
      return path
    } else {
      return new URL(path, this.baseURL).href
    }
  }
}
