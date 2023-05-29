import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { session } from '@/services'
import { useAppStore } from '@/stores'
import Shell from '../views/Shell.vue'
import Services from '../views/Services.vue'
import ServiceShell from '../views/ServiceShell.vue'
import Registration from '../views/Registration.vue'
import Login from '../views/Login.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Faq from '../components/Faq.vue'

import {
  canUserAccess,
  getRedirectRoute,
  getRedirectRouteBasedOnPath,
  isAuthRoute,
  isLoginOrRegistrationRoute,
  isPrivateRoute,
  shouldDeveloperAccessRoute,
  shouldRedirectToLogin
} from '@/router/route-utils'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: Shell,
    children: [
      {
        path: '/login/:sso?',
        name: 'login',
        meta: {
          title: 'Log In'
        },
        component: Login
      },
      {
        path: '/register',
        name: 'registration',
        meta: {
          title: 'Registration'
        },
        component: Registration
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        meta: {
          title: 'Forgot Password'
        },
        component: ForgotPassword
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        meta: {
          title: 'Reset Password'
        },
        component: ResetPassword
      },
      {
        path: '',
        name: 'catalog',
        meta: {
          title: 'Service Catalog'
        },
        component: Services
      },
      // Faq navigation
      {
        path: '/faq',
        name: 'faq',
      
        component: Faq
      },
      {
        // Nest Service-related routes, so they can use a unified shell component
        // that provides the navigation sidebar and handles service data fetching.
        // All child routes have the current Service injected in the `service` prop.
        path: '/',
        component: ServiceShell,
        children: [
          {
            path: '/spec/:service_package/:service_version?',
            name: 'spec',
            meta: {
              title: 'API Spec',
              isAuthorized: (route, { portalId }) => canUserAccess({
                service: 'konnect',
                action: '#view',
                resourcePath: `portals/${portalId}/services/${route.params.service_package}`
              })
            },
            component: () => import('../views/Spec.vue')
          },
          {
            path: '/docs/:service_package/:slug*',
            name: 'api-documentation-page',
            meta: {
              title: 'API Docs',
              isAuthorized: (route, { portalId }) => canUserAccess({
                service: 'konnect',
                action: '#view',
                resourcePath: `portals/${portalId}/services/${route.params.service_package}`
              })
            },
            component: () => import('../views/ApiDocumentationPage.vue')
          }
        ]
      },
      {
        path: '/my-apps',
        name: 'my-apps',
        meta: {
          title: 'My Apps'
        },
        component: () => import('../views/MyApps.vue')
      },
      {
        path: 'application',
        name: 'root-application',
        redirect: 'application/create',
        component: Shell,
        children: [
          {
            path: 'create',
            name: 'create-application',
            meta: {
              title: 'Create New Application'
            },
            component: () => import('../views/Applications/ApplicationForm.vue')
          },
          {
            path: ':application_id',
            name: 'application',
            meta: { title: 'Create Application' },
            component: () => import('../views/Shell.vue'),
            children: [
              {
                path: '',
                name: 'show-application',
                meta: { title: 'Application' },
                component: () => import('../views/Applications/ApplicationDetail.vue')
              },
              {
                path: 'update',
                name: 'update-application',
                meta: { title: 'Update Application' },
                component: () => import('../views/Applications/ApplicationForm.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/404',
        name: 'not-found',
        meta: {
          name: 'Not Found'
        },
        component: () => import('../views/NotFound.vue')
      },
      {
        path: '/403',
        name: 'forbidden',
        meta: {
          name: 'Forbidden'
        },
        component: () => import('../views/Forbidden.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found-redirect',
        meta: {
          title: 'Not Found'
        },
        component: () => {
          window.location.href = '/404'
        }
      }
    ]
  }
]

export const portalRouter = () => {
  const appStore = useAppStore()
  const { portalId, globalLoading, isPublic } = storeToRefs(appStore)

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })

  router.beforeEach((to, from, next) => {
    document.title = `${typeof to.meta.title === 'function'
      ? to.meta.title(to)
      : to.meta.title || ''
      } | Developer Portal`
    next()
  })

  // check is authenticated developer
  router.beforeEach(async (to, from, next) => {
    const sessionDoesExist = session.exists()

    // check if needed refirect after SSO login to the page to which we tried access previously
    if (
      shouldRedirectUserToPreviouslyAccessedRoute({
        isPublic: isPublic.value,
        to,
        previousRoute: session.data?.to
      })
    ) {
      return next(getRedirectRouteBasedOnPath(session.data.to, from.fullPath))
    }

    if (shouldRedirectToLogin({ isPublic: isPublic.value, isSessionInvalid: !sessionDoesExist, to })) {
      await appStore.logout(to.fullPath)

      return next(getRedirectRoute('login', from.name))
    }

    if (!await shouldDeveloperAccessRoute(to, { portalId: portalId.value })) {
      return next(getRedirectRoute('forbidden', from.name))
    }

    globalLoading.value = false

    const redirectHome =
      (!isPublic.value &&
        sessionDoesExist &&
        isLoginOrRegistrationRoute(to.name)) ||
      (isPublic.value && isPrivateRoute(to.name))
    if (redirectHome) {
      return next(getRedirectRoute('catalog', from.name))
    }

    next()
  })

  return router
}

export function shouldRedirectUserToPreviouslyAccessedRoute({
  isPublic,
  to,
  previousRoute
}) {
  const urlSearchParams = window && new URL(window.location.href)?.searchParams

  return (
    !isPublic &&
    urlSearchParams?.get('loginSuccess') === 'true' &&
    previousRoute !== undefined &&
    to.fullPath !== previousRoute &&
    !isAuthRoute(to.name)
  )
}
