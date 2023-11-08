import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import { ProductAction, usePermissionsStore } from '@/stores'

export const AUTH_ROUTES = {
  login: true,
  registration: true,
  'forgot-password': true,
  'reset-password': true
}

export const PRIVATE_ROUTES = {
  'my-apps': true,
  application: true,
  'root-application': true,
  'create-application': true,
  'show-application': true,
  'update-application': true,
  ...AUTH_ROUTES
}

export function canUserAccess (krnArgs: { action: ProductAction; productId: string }) {
  const { canUserAccess } = usePermissionsStore()

  return canUserAccess(krnArgs)
}

export function shouldRedirectToLogin ({ isPublic, isSessionInvalid, to }) {
  // If there is private portal and session is invalid (user not logged in)
  // and route is only available to logged users

  return !isPublic && isSessionInvalid && !isAuthRoute(to.name)
}

export function isAuthRoute (routeName) {
  return !!AUTH_ROUTES[routeName]
}

export function isPrivateRoute (routeName) {
  return !!PRIVATE_ROUTES[routeName]
}

export function isLoginOrRegistrationRoute (routeName) {
  return routeName === 'login' || routeName === 'registration'
}

export function getRedirectRoute (redirectName, fromName) {
  return redirectName !== fromName && { name: redirectName }
}

export function getRedirectRouteBasedOnPath (redirectToPath, fromPath) {
  return redirectToPath !== fromPath && { path: redirectToPath }
}

export function removeQueryParam (queryParam) {
  const url = window.location.href
  const r = new URL(url)

  r.searchParams.delete(queryParam)
  const newUrl = r.href

  window.history.pushState({ path: newUrl }, '', newUrl)
}

// This function is supposed to check KRN permissions or any explicit defined cgeck
// if it exists for route in `meta.isAuthorized`
// Common case look like we might want to chceck for only KRN there like
// isAuthorized: route => canUserAccess({ service: 'accounts', action: '#consume', resourcePath: 'somePath }),

export async function verifyDeveloperIsAuthorizedForRoute (to, data) {
  // Set to true if the meta.isAuthorized is not set on the route
  // or if meta.isAuthrized evaluates to true (via boolean or calling the function)
  return to.meta?.isAuthorized === undefined ||
  to.meta?.isAuthorized === true ||
  (typeof to.meta?.isAuthorized === 'function' && await to.meta?.isAuthorized(to, data) === true)
}

// This function is supposed to check all meta requirements related to access permission to that route
// except for KRN permissions.
// For now it's only realted to LD feature flag, in future we might extend it as it's done in Konnect

export function verifyDeveloperFulfillMetaForRoute (to) {
  if (to?.matched?.length > 0) {
    const matchedEvery = to.matched.every((match) => {
      if (!Object.prototype.hasOwnProperty.call(match.meta, 'featureFlagsLD')) {
        return true
      }

      // if LD feature flags are defined, route should evaluate each of those as true, otherwise we can return true
      return (
        !match.meta.featureFlagsLD ||
        match.meta.featureFlagsLD.every((featureFlagsLD) => {
          const { key, value, defaultValue = false } = featureFlagsLD

          return useLDFeatureFlag(key, defaultValue) === value
        })
      )
    })

    return matchedEvery
  }

  // Originally this function returned 'true' by default. Since this condition only returns if there are no to.matched routes, this should be able to safely return true by default since the route would not exist.

  return true
}

// Combine both checks and should be used as default one to check developer permissions

export async function shouldDeveloperAccessRoute (to, data) {
  return verifyDeveloperFulfillMetaForRoute(to) && await verifyDeveloperIsAuthorizedForRoute(to, data)
}
