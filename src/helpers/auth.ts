import { isAuthRoute } from '@/router/route-utils'
import { NavigationFailureType, Router, isNavigationFailure } from 'vue-router'

export function createRedirectHandler (router: Router, logout: (path?: string) => Promise<string>) {
  return async () => {
    if (isAuthRoute(router.currentRoute.value.name)) {
      // already on auth route, no need to logout or redirect
      return
    }

    await logout(router.currentRoute.value.fullPath)
    router.push({ name: 'login' }).catch((error) => {
      if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
        throw Error(error)
      }
    })
  }
}
