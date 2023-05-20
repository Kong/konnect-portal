
describe('Login Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.intercept('POST', '**/kauth/api/v1/developer-logout', {
      statusCode: 200,
      body: {},
      delay: 300
    }).as('userLogout')
  })

  it('is prompted to login', () => {
    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')

    cy.visit('/spec/123', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')
  })

  it('should have UI elements correctly', () => {
    cy.mockGetUserInfo()

    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')

    cy.get('input[id=email]').should('be.empty')
    cy.get('input[id=password]').should('be.empty')
    cy.get('.k-button.primary').should('contain', 'Log in')
    cy.get('[data-testid="sign-up-encouragement-message"]').should('exist')
  })

  it('sets auth cookie when logging in via form submission', () => {
    cy.mockSuccessfulDeveloperAuth()
    cy.mockGetUserInfo()

    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')

    cy.get('input[id=email]').type('email@email.com')
    // {enter} causes the form to submit
    cy.wait(500)
    cy.get('input[id=password]').type('123{enter}')

    cy.location('pathname').should('equal', '/')
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(localStorage.getItem('konnect_portal_session')).to.not.be.null
      })

    cy.get('[data-testid="header-register-btn"]').should('not.exist')
  })

  it('routes to intended page after login', () => {
    cy.mockSuccessfulDeveloperAuth()
    cy.intercept('GET', '/api/v2/search/product-catalog*', {
      statusCode: 200,
      body: {
        count: 0,
        limit: 12,
        offset: 0,
        data: []
      },
      delay: 300
    }).as('getServices')

    cy.mockGetUserInfo()

    cy.visit('/spec/test', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('input[id=email]').type('email@email.com')
    cy.wait(500)
    cy.get('input[id=password]').type('foo{enter}')

    cy.wait('@userAuthenticate').then(() => {
      cy.setCookie('CYPRESS_USER_SESSION_EXISTS', 'CYPRESS_USER_SESSION_EXISTS')
    }).wait('@getUserInfo').then(() => {
      cy.location('pathname').should('equal', '/spec/test')
    })
  })

  it('can logout', () => {
    cy.mockSuccessfulDeveloperAuth()
    cy.mockGetUserInfo()
    cy.intercept('GET', '/api/v2/search/product-catalog*', {
      statusCode: 200,
      body: {
        count: 0,
        limit: 12,
        offset: 0,
        data: []
      },
      delay: 300
    }).as('getServices')

    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('input[id=email]').type('email@email.com')
    cy.wait(500)
    cy.get('input[id=password]').type('foo{enter}')

    cy.wait('@userAuthenticate').then(() => {
      cy.setCookie('CYPRESS_USER_SESSION_EXISTS', 'CYPRESS_USER_SESSION_EXISTS')
    }).wait('@getUserInfo').then(() => {
      cy.get('[data-testid="user-dropdown"]').click()
      cy.get('[data-testid="logout-item"]').click()
      cy.location('pathname').should('equal', '/login')
    })
  })

  it('is denied access and shows error message on bad credentials', () => {
    cy.intercept('POST', '/kauth/api/v1/developer-authenticate', {
      statusCode: 401,
      body: {
        data: {
          errors: [
            {
              status: '401',
              code: '1003',
              title: 'Invalid username or password',
              detail: 'you have entered an invalid username or password (#1003)'
            }
          ]
        }
      },
      delay: 300
    }).as('userAuthenticate')
    cy.visit('/login', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('input[id=email]').type('uh')
    cy.wait(500)
    cy.get('input[id=password]').type('not-valid{enter}')

    cy.wait('@userAuthenticate').then(() => {
      cy.url().should('include', '/login')
      cy.get('[data-testid="kong-auth-error-message"]')
        .should('contain', 'Incorrect username or password. Please try again.')
    })
  })

  it('is denied access and shows error message when developer not yet allowed access', () => {
    cy.intercept('POST', '/kauth/api/v1/developer-authenticate', {
      statusCode: 401,
      body: {
        errors: [
          {
            status: '401',
            code: '1007',
            title: 'Account is disabled',
            detail: 'user account is disabled (#1007)'
          }
        ]
      },
      delay: 300
    }).as('userAuthenticate')
    cy.visit('/login', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('input[id=email]').type('uh')
    cy.wait(500)
    cy.get('input[id=password]').type('not-valid{enter}')

    cy.wait('@userAuthenticate').then(() => {
      cy.url().should('include', '/login')
      cy.get('[data-testid="kong-auth-error-message"]')
        .should('contain', 'Your account is pending approval for access')
    })
  })

  it('confirms email and resets password when developer status is pending', () => {
    cy.intercept('PATCH', '/kauth/api/v1/developer-email-verifications', {
      statusCode: 200,
      body: {
        email: 'email',
        resetToken: 'token'
      },
      delay: 300
    }).as('verifyEmailToken')

    cy.intercept('PATCH', '/kauth/api/v1/developer-password-resets', {
      statusCode: 200,
      body: {
        email: 'testing123@gmail.com'
      },
      delay: 300
    }).as('passwordReset')
    cy.visit('/login?email=testing12302%40gmail.com&token=123', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')

    cy.wait('@verifyEmailToken').then(() => {
      cy.get('[data-testid="kong-auth-reset-password-new-password"]').should('exist')
      cy.get('[data-testid="kong-auth-reset-password-confirm-new-password"]').should('exist')

      cy.get('input[id=password]').type('123')
      // {enter} causes the form to submit
      cy.wait(500)
      cy.get('input[id=password-confirm]').type('123{enter}')

      cy.wait('@passwordReset').then(() => {
        // returns to the login page
        cy.get('[data-testid="kong-auth-login-password-reset-message"]')
          .should('contain', 'Password successfully set!')

        cy.get('input[id=email]').should('exist')
      })
    })
  })

  it('throws 500 error when confirmation token has been used', () => {
    cy.intercept('PATCH', '/kauth/api/v1/developer-email-verifications', {
      statusCode: 500,
      body: {
        errors: [
          {
            status: '500',
            title: 'Internal Server Error',
            detail: 'invalid status update request'
          }
        ]
      },
      delay: 300
    }).as('verifyEmailToken')
    cy.visit('/login?email=testing123%40gmail.com&token=123', { useOriginalFn: true })

    cy.wait('@verifyEmailToken').then(() => {
      // returns to the login page
      cy.location('pathname').should('equal', '/login')
      cy.get('[data-testid="kong-auth-error-message"]')
        .should('contain', 'Invalid status update request')

      cy.get('input[id=email]').should('exist')
    })
  })

  it('shows Login with SSO button', () => {
    cy.mockPrivatePortal({ oidc_auth_enabled: true, basic_auth_enabled: false })

    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')
    cy.get('[data-testid="sign-up-encouragement-message"]').should('not.exist')
    cy.get('[data-testid="kong-auth-login-sso"]').should('exist')
  })

  it('does not show Login with SSO button', () => {
    cy.mockPrivatePortal({ oidc_auth_enabled: false })

    cy.visit('/', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')
    cy.get('[data-testid="kong-auth-login-sso"]').should('not.exist')
  })

  it('routes to intended page after SSO login', () => {
    cy.intercept('**/kauth/api/v1/developer-authenticate/123*', (req) => {
      req.redirect(`${Cypress.config().baseUrl}?loginSuccess=true`, 301)
    })

    cy.mockGetUserInfo()
    cy.mockPrivatePortal({ oidc_auth_enabled: true })

    cy.visit('/spec/test', { useOriginalFn: true })
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-testid="auth-form"]').should('be.visible')
    cy.get('[data-testid="kong-auth-login-sso"]').should('be.visible').click()
    cy.mockServicePackage('*')
    cy.mockServicePackageDocumentTree()
    cy.mockProductVersionSpec()
    cy.mockServiceOperations()
    cy.location('pathname').should('equal', '/spec/test')
  })

  it('does not hang on loading when loginSuccess provided by user', () => {
    cy.intercept('GET', '**/api/v2/developer/me', {
      statusCode: 401,
      body: {
      },
      delay: 300
    }).as('getUserInfo')

    cy.visit('/?loginSuccess=true', { useOriginalFn: true })

    cy.wait('@getUserInfo')

    cy.get('[data-testid="auth-form"]').should('be.visible')

    cy.location('pathname').should('equal', '/login')
    cy.location('search').should('equal', '')
  })
})
