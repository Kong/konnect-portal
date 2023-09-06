describe('Register Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockStylesheetFont()
    cy.mockDeveloperLogout()
  })

  describe('register', () => {
    it('can register', () => {
      cy.intercept('POST', '**/api/v2/developer', {
        statusCode: 201,
        body: {},
        delay: 300
      }).as('registerDeveloper')

      cy.visit('/register', { useOriginalFn: true })
      cy.wait(100)
      cy.get('input[id=full_name]').type('Joe Baker')
      cy.get('input[id=email]').type('joe@baker.com{enter}')
      cy.get('form button').should('contain', 'Submitting')
      cy.wait('@registerDeveloper').then(() => {
        cy.get('[data-testid="kong-auth-login-register-success-message"]').should('contain', 'Please check your email to confirm your address.')
      })
    })

    it('displays error for bad email', () => {
      cy.intercept('POST', '**/api/v2/developer', {
        statusCode: 400,
        body: {
          message: [
            {
              property: 'data',
              children: [
                {
                  property: 'email',
                  children: [],
                  constraints: {
                    isEmail: 'email must be an email'
                  }
                }
              ]
            }
          ]
        },
        delay: 300
      }).as('registerDeveloper')

      cy.visit('/register', { useOriginalFn: true })
      cy.wait(100)
      cy.get('input[id=full_name]').type('Joe Baker')
      cy.get('input[id=email]').type('notanemail{enter}')
      // {enter} causes the form to submit
      cy.get('.k-alert').should('contain', 'Email must be a valid email address')
    })

    it('redirects to login when basic auth disabled', () => {
      cy.mockPrivatePortal({ basic_auth_enabled: false })

      cy.visit('/', { useOriginalFn: true })
      cy.location('pathname').should('equal', '/login')
      cy.get('[data-testid="auth-form"]').should('be.visible')
      cy.get('[data-testid="sign-up-encouragement-message"]').should('not.exist')
      cy.get('[data-testid="kong-auth-login-sso"]').should('not.exist')
    })
    it('redirects to login (with SSO) when basic auth disabled', () => {
      cy.mockPrivatePortal({ basic_auth_enabled: false, oidc_auth_enabled: true })

      cy.visit('/', { useOriginalFn: true })
      cy.location('pathname').should('equal', '/login')
      cy.get('[data-testid="auth-form"]').should('be.visible')
      cy.get('[data-testid="sign-up-encouragement-message"]').should('not.exist')
      cy.get('[data-testid="kong-auth-login-sso"]').should('exist')
    })
  })
})
