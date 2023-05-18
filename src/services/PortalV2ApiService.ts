import axios, { AxiosInstance } from 'axios'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'
import {
  Configuration,
  PortalApi,
  ApplicationsApi,
  SearchApi,
  CredentialsApi,
  DeveloperApi,
  ProductsApi,
  RegistrationsApi,
  DocumentationApi,
  VersionsApi
} from '@kong/sdk-portal-js'

export const ApiServiceAuthErrorReason = {
  NO_SESSION: 'NO_SESSION',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  RESPONSE_FORBIDDEN: 'RESPONSE_FORBIDDEN'
}

export default class PortalV2ApiService {
  private baseURL: string

  private failedQueue: any[] = []

  private authErrorCallback: any = null

  private client: AxiosInstance

  private session: any

  public service: {
    portalApi: PortalApi,
    applicationsApi: ApplicationsApi,
    searchApi: SearchApi,
    credentialsApi: CredentialsApi,
    developerApi: DeveloperApi,
    productsApi: ProductsApi,
    registrationsApi: RegistrationsApi,
    documentationApi: DocumentationApi,
    versionsApi: VersionsApi
  }

  setAuthErrorCallback (authErrorCallback) {
    this.authErrorCallback = authErrorCallback
  }

  constructor (baseURL) {
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1)
    }

    this.baseURL = baseURL

    this.authErrorCallback = () => false

    this.client = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: {
        accept: 'application/json'
      }
    })

    const baseConfig = new Configuration({
      basePath: '',
      accessToken: this.session?.getAccessToken()
    })

    this.service = {
      portalApi: new PortalApi(baseConfig, this.baseURL, this.client),
      applicationsApi: new ApplicationsApi(baseConfig, this.baseURL, this.client),
      searchApi: new SearchApi(baseConfig, this.baseURL, this.client),
      credentialsApi: new CredentialsApi(baseConfig, this.baseURL, this.client),
      developerApi: new DeveloperApi(baseConfig, this.baseURL, this.client),
      productsApi: new ProductsApi(baseConfig, this.baseURL, this.client),
      registrationsApi: new RegistrationsApi(baseConfig, this.baseURL, this.client),
      documentationApi: new DocumentationApi(baseConfig, this.baseURL, this.client),
      versionsApi: new VersionsApi(baseConfig, this.baseURL, this.client)
    }

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
            const sessionDoesExist = this.session?.exists()

            // If session does not exist it's not worth to even try to refresh
            if (!sessionDoesExist) {
              if (this.authErrorCallback) {
                this.authErrorCallback(originalErr, ApiServiceAuthErrorReason.NO_SESSION)
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
                  this.authErrorCallback(originalErr, ApiServiceAuthErrorReason.SESSION_EXPIRED)
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
          this.authErrorCallback(originalErr, ApiServiceAuthErrorReason.RESPONSE_FORBIDDEN)
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
    if (this.baseURL === '') {
      return path
    } else {
      return new URL(path, this.baseURL).href
    }
  }
}
