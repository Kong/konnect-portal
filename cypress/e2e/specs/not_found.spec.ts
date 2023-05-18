describe('Not Found Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
  })

  describe('not found spec', () => {
    it('shows a "not found" page when viewing an invalid route', () => {
      cy.visit('/oooooooooo')
      cy.get('.not-found').should('contain', 'Sorry. We cannot find the page you are looking for.')
      cy.get('#site-header').should('exist')
      cy.url().should('include', '/404')
    })

    it('allows able to move to home using button available on 404 page', () => {
      cy.visit('/oooooooooo')
      cy.get('[data-testid="go-home"]').click()
      cy.get('.services-welcome').should('exist')
    })
  })
})
