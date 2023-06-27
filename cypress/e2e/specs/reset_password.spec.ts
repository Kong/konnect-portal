describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockSuccessfulPasswordReset()
  })
  it('Sends token to backend that developer can get from email and resets password', () => {
    cy.intercept('POST', '**/developer/reset-password', {
      statusCode: 204,
      delay: 300
    }).as('resetPassword')

    cy.visit('/forgot-password', { useOriginalFn: true })
    cy.wait('@isPublicPortal').then(() => {
      cy.wait(100)
      cy.get('#email.k-input').type('testing123@email.com{enter}')
      cy.get('.k-alert-msg').should('contain', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, please check your spam folder.')

      // Since we aren't actually going to be grabbing a token from the backend,
      // we are waiting here to confirm the request that would be sent has been
      // sent - and then visit the link where we would reset a password.
      cy.wait('@sendPasswordReset').then(() => {
        cy.wait(100)
        cy.visit('/reset-password?email=testing123%40email.com&token=123', { useOriginalFn: true })

        cy.get('[data-testid="kong-auth-reset-password-new-password"]').should('exist')
        cy.get('[data-testid="kong-auth-reset-password-confirm-new-password"]').should('exist')

        cy.get('input[id=password]').type('123')
        // {enter} causes the form to submit
        cy.get('input[id=password-confirm]').type('123{enter}')

        cy.wait('@resetPassword').then(() => {
          // returns to the login page
          cy.get('[data-testid="kong-auth-login-password-reset-message"]')
            .should('contain', 'Password successfully set!')

          cy.get('input[id=email]').should('exist')
        })
      })
    })
  })
  it('Errors out if reset token is invalid', () => {
    cy.intercept('POST', '**/developer/reset-password', {
      statusCode: 500,
      body:
      {
        "status": 500,
        "title": "Internal",
        "instance": "konnect:trace:1115722991246784904",
        "detail": "An internal failure occurred"
      },
      delay: 300
    }).as('resetPassword')

    cy.visit('/forgot-password', { useOriginalFn: true })
    cy.wait('@isPublicPortal').then(() => {
      cy.wait(200)
      cy.get('#email.k-input').type('testing123@email.com{enter}')
      cy.get('.k-alert-msg').should('contain', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, please check your spam folder.')

      // Since we aren't actually going to be grabbing a token from the backend,
      // we are waiting here to confirm the request that would be sent has been
      // sent - and then visit the link where we would reset a password.
      cy.wait('@sendPasswordReset').then(() => {
        cy.wait(200)
        cy.visit('/reset-password?email=testing123%40email.com&token=123', { useOriginalFn: true })

        cy.get('[data-testid="kong-auth-reset-password-new-password"]').should('exist')
        cy.get('[data-testid="kong-auth-reset-password-confirm-new-password"]').should('exist')

        cy.get('input[id=password]').type('123')
        // {enter} causes the form to submit
        cy.get('input[id=password-confirm]').type('123{enter}')

        cy.wait('@resetPassword').then(() => {
          // Stays on the page as token is invalid
          cy.get('[data-testid="kong-auth-error-message"]').should('contain', 'An internal failure occurred')
          cy.location('pathname').should('equal', '/reset-password')
        })
      })
    })
  })
})
