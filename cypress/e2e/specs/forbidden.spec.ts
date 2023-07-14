describe('Forbidden Page', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockStylesheetFont()
  })

  it('shows a "forbidden" page', () => {
    cy.visit('/403')
    cy.get('.forbidden').should('contain', 'Sorry. You are not authorized to view this page.')
    cy.get('#site-header').should('exist')
  })

  it('allows able to move to home using button', () => {
    cy.mockProductsCatalog()
    cy.visit('/403')
    cy.get('[data-testid="go-home"]').click()
    cy.get('.products-welcome').should('exist')
  })
})
