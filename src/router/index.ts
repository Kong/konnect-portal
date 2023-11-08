import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { session } from '@/services'
import { useAppStore, useI18nStore } from '@/stores'

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

const ProductCatalogWrapper = () => import('../views/ProductCatalogWrapper.vue')
const ProductShell = () => import('../views/ProductShell.vue')
const Shell = () => import('../views/Shell.vue')
const Registration = () => import('../views/Registration.vue')
const ForgotPassword = () => import('../views/ForgotPassword.vue')
const ResetPassword = () => import('../views/ResetPassword.vue')
const Login = () => import('../views/Login.vue')

export const portalRouter = () => {
  const appStore = useAppStore()
  const { portalId, globalLoading, isPublic } = storeToRefs(appStore)
  const helpText = useI18nStore().state.helpText.router

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        component: Shell,
        children: [
          {
            path: '/login/:sso?',
            name: 'login',
            meta: {
              title: helpText.loginTitle
            },
            component: Login
          },
          {
            path: '/register',
            name: 'registration',
            meta: {
              title: helpText.registrationTitle
            },
            component: Registration
          },
          {
            path: '/forgot-password',
            name: 'forgot-password',
            meta: {
              title: helpText.forgotPasswordTitle
            },
            component: ForgotPassword
          },
          {
            path: '/reset-password',
            name: 'reset-password',
            meta: {
              title: helpText.resetPasswordTitle
            },
            component: ResetPassword
          },
          {
            path: '',
            name: 'catalog',
            meta: {
              title: helpText.catalogTitleProduct
            },
            component: ProductCatalogWrapper
          },
          {
            // Nest Service-related routes, so they can use a unified shell component
            // that provides the navigation sidebar and handles product data fetching.
            // All child routes have the current Service injected in the `product` prop.
            path: '/',
            component: ProductShell,
            children: [
              {
                path: '/spec/:product/:product_version?',
                name: 'spec',
                meta: {
                  title: helpText.specTitle,
                  isAuthorized: (route) => canUserAccess({
                    action: 'view',
                    productId: route.params.product
                  })
                },
                component: () => import('../views/Spec.vue')
              },
              {
                path: '/docs/:product/:slug*',
                name: 'api-documentation-page',
                meta: {
                  title: helpText.docsTitle,
                  isAuthorized: (route) => canUserAccess({
                    action: 'view',
                    productId: route.params.product
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
              title: helpText.appsTitle
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
                  title: helpText.createAppTitle
                },
                component: () => import('../views/Applications/ApplicationForm.vue')
              },
              {
                path: ':application_id',
                name: 'application',
                meta: { title: helpText.createAppTitle2 },
                component: () => import('../views/Shell.vue'),
                children: [
                  {
                    path: '',
                    name: 'show-application',
                    meta: { title: helpText.viewAppTitle },
                    component: () => import('../views/Applications/ApplicationDetail.vue')
                  },
                  {
                    path: 'update',
                    name: 'update-application',
                    meta: { title: helpText.updateAppTitle },
                    component: () => import('../views/Applications/ApplicationForm.vue')
                  },
                  {
                    path: 'application-dashboard',
                    name: 'application-dashboard',
                    meta: { title: 'Application Dashboard' },
                    component: () => import('../views/Applications/ApplicationDashboard.vue')
                  }
                ]
              }
            ]
          },
          {
            path: '/404',
            name: 'not-found',
            meta: {
              name: helpText.notFoundTitle
            },
            component: () => import('../views/NotFound.vue')
          },
          {
            path: '/403',
            name: 'forbidden',
            meta: {
              name: helpText.forbiddenTitle
            },
            component: () => import('../views/Forbidden.vue')
          },
          {
            path: '/:pathMatch(.*)*',
            name: 'not-found-redirect',
            meta: {
              title: helpText.notFoundTitle
            },
            component: () => {
              window.location.href = '/404'
            }
          }
        ]
      }
    ]
  })

  const portalTitle = helpText.portalTitle

  router.beforeEach((to, from, next) => {
    const metaTitle = typeof to.meta.title === 'function'
      ? to.meta.title(to)
      : to.meta.title || ''

    document.title = `${metaTitle} | ${portalTitle}`
    next()
  })

  // check is authenticated developer
  router.beforeEach(async (to, from, next) => {
    if (to.meta.public) {
      return next()
    }

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

export function shouldRedirectUserToPreviouslyAccessedRoute ({
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
