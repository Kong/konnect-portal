describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockStylesheetFont()
  })

  it('has link from login page', () => {
    cy.visit('/login', { useOriginalFn: true })
    cy.get('[data-testid="kong-auth-login-forgot-password-link"]').should('be.visible')
  })

  it('should have UI elements correctly', () => {
    cy.visit('/forgot-password', { useOriginalFn: true })
    cy.get('.k-input-label').should('contain', 'Email')
    cy.get('.k-button.primary').should('contain', 'Recover password')
    cy.get('.k-button.primary').should('have.attr', 'disabled', 'disabled')
  })

  it('Shows success on password send', () => {
    cy.intercept('POST', '**/api/v2/developer/forgot-password', {
      statusCode: 200,
      delay: 300
    }).as('sendPasswordReset')
    cy.visit('/forgot-password', { useOriginalFn: true })
    cy.get('#email.k-input').type('email@example.com{enter}')
    cy.get('.k-alert-msg').should('contain', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, please check your spam folder.')
    cy.get('.k-button.primary').click()
    cy.location('pathname').should('equal', '/login')
  })

  it('Shows error on invalid email', () => {
    cy.intercept('POST', '/api/v2/developer/forgot-password', {
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
    }).as('sendPasswordReset')
    cy.visit('/forgot-password', { useOriginalFn: true })
    cy.get('#email.k-input').type('notAnEmail.com{enter}')
    cy.get('[data-testid="kong-auth-error-message"]').should('contain', 'Email must be a valid email address')
  })
})
