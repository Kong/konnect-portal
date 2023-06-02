import { v4 as uuidv4 } from 'uuid'

const productId = 'a5afb115-025e-4da1-a013-bf05b326e0a51'
const productVersionId = '1afac832-5b2a-474c-a56d-c241364f41cf'
const applicationId = uuidv4()

const matrix = {
  isNotPublic: {
    unauthenticated: {
      redirectToLogin: [
        '/',
        '/application/:applicationId',
        '/application/create',
        '/my-apps',
        '/spec/:productId',
        '/spec/:productId/:productVersionId'
      ],
      viewable: [
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password'
      ]
    },
    authenticated: {
      viewable: [
        '/',
        '/application/:applicationId',
        '/application/create',
        '/my-apps',
        '/forgot-password',
        '/reset-password',
        '/spec/:productId',
        '/spec/:productId/:productVersionId'
      ],
      redirectToSlash: [
        '/login',
        '/register'
      ]
    }
  },
  isPublic: {
    authenticated: {
      viewable: [
        '/',
        '/spec/:productId',
        '/spec/:productId/:productVersionId'
      ],
      redirectToSlash: [
        '/application/:applicationId',
        '/application/create',
        '/my-apps',
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password'
      ]
    },
    unauthenticated: {
      viewable: [
        '/',
        '/spec/:productId',
        '/spec/:productId/:productVersionId'
      ],
      redirectToSlash: [
        '/application/:applicationId',
        '/application/create',
        '/my-apps',
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password'
      ]
    }
  }
}

const replaceRouteValues = route => route
  .replace(/:productId/g, productId)
  .replace(/:productVersionId/g, productVersionId)
  .replace(/:applicationId/g, applicationId)

// when true it means that it tried to access without cookie set
const aliasVisitAndWait = (route, useOriginalFn = true) => {
  cy.intercept('GET', '**/api/v2/portal').as('getPortalContext')
  cy.visit(route, { useOriginalFn })
  cy.wait('@getPortalContext')
}

describe('Portal Auth', () => {
  describe('Private Portal - Unauthenticated', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
    })

    matrix.isNotPublic.unauthenticated.redirectToLogin.forEach((route) => {
      it(`redirects ${route} to /login when unauthenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route)

        cy.location('pathname').should('equal', '/login')
        cy.get('[data-testid="kong-auth-login-form"]').should('be.visible')
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })

    matrix.isNotPublic.unauthenticated.viewable.forEach((route) => {
      it(`shows ${route} when unauthenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route)

        cy.location('pathname').should('equal', route)
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })
  })

  describe('Private Portal - Authenticated', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
    })

    matrix.isNotPublic.authenticated.viewable.forEach((route) => {
      it(`shows ${route} when authenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route, false)

        cy.location('pathname').should('equal', route)
        cy.get('[data-testid="kong-auth-login-form"]').should('not.exist')
      })
    })

    matrix.isNotPublic.authenticated.redirectToSlash.forEach((route) => {
      it(`redirects ${route} to / when authenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route, false)

        cy.location('pathname').should('equal', '/')
        cy.get('[data-testid="user-dropdown"]').should('exist')
      })
    })
  })

  describe('Public Portal - Authenticated', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
    })

    matrix.isPublic.unauthenticated.viewable.forEach((route) => {
      it(`shows ${route} when authenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route, false)

        cy.location('pathname').should('equal', route)
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })

    matrix.isPublic.unauthenticated.redirectToSlash.forEach((route) => {
      it(`redirects ${route} to the / when authenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route, false)

        cy.location('pathname').should('equal', '/')
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })
  })

  describe('Public Portal - Unauthenticated', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
    })

    matrix.isPublic.unauthenticated.viewable.forEach((route) => {
      it(`shows ${route} when unauthenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route)

        cy.location('pathname').should('equal', route)
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })

    matrix.isPublic.unauthenticated.redirectToSlash.forEach((route) => {
      it(`redirects ${route} to / when unauthenticated`, () => {
        route = replaceRouteValues(route)

        aliasVisitAndWait(route)

        cy.location('pathname').should('equal', '/')
        cy.get('[data-testid="user-dropdown"]').should('not.exist')
      })
    })
  })
})
