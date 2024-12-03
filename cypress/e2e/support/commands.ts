Cypress.Commands.add('assertViewMode', (mode: 'table' | 'card') => {
  if (mode === 'table') {
    cy.get('.k-table').should('exist')
    cy.get('.catalog-card-view').should('not.exist')
  } else {
    cy.get('.catalog-card-view').should('exist')
    cy.get('.k-table').should('not.exist')
  }
})

Cypress.Commands.add('selectViewMode', (mode: 'table' | 'card') => {
  cy.get('[data-testid="view-switcher"]').should('exist').and('be.visible')

  cy.get('body').then($body => {
    const isTableMode = $body.find('.k-table').length > 0
    const isCardMode = $body.find('.catalog-card-view').length > 0

    if ((mode === 'table' && !isTableMode) || (mode === 'card' && !isCardMode)) {
      cy.get('[data-testid="view-switcher"]').click()
    }
  })

  // Verify the correct mode is now active
  if (mode === 'table') {
    cy.get('.k-table', { timeout: 5000 }).should('exist')
    cy.get('.catalog-card-view').should('not.exist')
  } else {
    cy.get('.catalog-card-view', { timeout: 5000 }).should('exist')
    cy.get('.k-table').should('not.exist')
  }
})
