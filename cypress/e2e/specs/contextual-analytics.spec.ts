import { apps, productRegistrations } from '../fixtures/consts'

const noAnalytics = {
  analytics: null
}

const hasAnalytics = {
  analytics: {
    percentiles: true,
    retention_ms: 36720000000
  }
}

const mockConfig = (analytics: boolean) => {
  cy.intercept('GET', '**/api/v2/stats/config', {
    statusCode: 200,
    body: analytics ? hasAnalytics : noAnalytics,
    delay: 0
  })
}

describe('Contextual Developer Analytics', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockApplications(apps, 4)
    cy.intercept('POST', '**/api/v2/stats*', {
      statusCode: 200,
      body: {
        records: []
      },
      delay: 0
    })
  })

  const selectors = {
    chartsParent: '[data-testid="analytics-charts"]',
    dashboardDropdownLink: '[data-testid="dropdown-analytics-dashboard"]',
    dateTimePicker: '[data-testid="analytics-timepicker"]',
    metricCardsParent: '[data-testid="analytics-metric-cards"]',
    viewAnalyticsButton: '[data-testid="application-dashboard-button"]'
  }

  it('My Apps – displays displays metric cards', () => {
    mockConfig(true)

    cy.mockApplications(apps, 4)

    cy.visit('/', { useOriginalFn: true })
    cy.visit('/my-apps')

    cy.get(selectors.metricCardsParent).should('exist')
    cy.get(selectors.metricCardsParent).find('.metricscard').should('have.length', 3)

    cy.get('[data-testid="applications-table"]').find('.actions-badge').first().click()
    cy.get(selectors.dashboardDropdownLink).should('exist')
  })


  it('App Dashboard - vitals elements load', () => {
    mockConfig(true)

    cy.mockApplications(apps, 4)

    cy.intercept('GET', `**/api/v2/applications/${apps[0].id}`, {
      statusCode: 200,
      body: apps[0],
      delay: 0
    }).as('getSingleApplication')

    cy.intercept(
      'GET',
      `**/api/v2/applications/${apps[0].id}/registrations*`,
      {
        body: {
          data: productRegistrations,
          meta: {
            page: {
              total: 1,
              number: 1,
              size: 1
            }
          }
        },
        delay: 0
      }
    ).as('getApplicationRegistration')

    cy.visit('/my-apps')

    // Navigate to Application Dashboard page
    cy.get('[data-testid="applications-table"]').find('.actions-badge').first().click()
    cy.get(selectors.dashboardDropdownLink).first().click()

    // All application dashboard elements should be present
    cy.get('.analytics-filters').should('exist')
    cy.get(selectors.metricCardsParent).should('exist')
    cy.get(selectors.chartsParent).should('exist')

    // Check that the Service Versions filter bar contains at least one item
    const mockedServiceVersionName = `${productRegistrations[0].product_name} - ${productRegistrations[0].product_version_name}`

    cy.get('[data-testid="k-multiselect-input"]').should('exist').click()
    cy.get('.k-multiselect-item').first().should('contain', mockedServiceVersionName)
  })

  it('My Apps – metric cards if no analytics', () => {
    mockConfig(false)

    cy.mockApplications(apps, 4)

    cy.visit('/', { useOriginalFn: true })
    cy.visit('/my-apps')

    cy.get(selectors.metricCardsParent).should('not.exist')

    cy.get('[data-testid="applications-table"]').find('.actions-badge').first().click()
    cy.get(selectors.dashboardDropdownLink).should('not.exist')
  })

  it('App Dashboard - no vitals elements if no analytics', () => {
    mockConfig(false)

    cy.mockApplications(apps, 4)

    cy.intercept('GET', `**/api/v2/applications/${apps[0].id}`, {
      statusCode: 200,
      body: apps[0],
      delay: 0
    }).as('getSingleApplication')

    cy.intercept(
      'GET',
      `**/api/v2/applications/${apps[0].id}/registrations*`,
      {
        body: {
          data: productRegistrations,
          meta: {
            page: {
              total: 1,
              number: 1,
              size: 1
            }
          }
        },
        delay: 0
      }
    ).as('getApplicationRegistration')

    cy.visit(`/application/${apps[0].id}/application-dashboard`)

    // There should be a forbidden page.
    cy.get('section.forbidden').should('exist')
  })
})
