import { apps, productRegistrations } from '../fixtures/consts'

describe('Contextual Developer Analytics', () => {
  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockApplications(apps, 4)
    cy.intercept('POST', '**/api/v2/stats*', {
      statusCode: 200,
      body: {
        records: [],
      },
      delay: 0,
    })
  })

  const selectors = {
    chartsParent: '[data-testid="analytics-charts"]',
    dashboardDropdownLink: '[data-testid="dropdown-analytics-dashboard"]',
    dateTimePicker: '[data-testid="analytics-timepicker"]',
    metricCardsParent: '[data-testid="analytics-metric-cards"]',
    viewAnalyticsButton: '[data-testid="application-dashboard-button"]',
  }

  it('My Apps – displays displays metric cards if the feature flag is on', () => {
    cy.mockLaunchDarklyFlags([{ name: 'ma-1002-dev-portal-contextual-analytics', value: true }])

    cy.mockApplications(apps, 4)

    cy.visit('/', { useOriginalFn: true })
    cy.visit('/my-apps')

    cy.get(selectors.metricCardsParent).should('exist')
    cy.get(selectors.metricCardsParent).find('.metricscard').should('have.length', 3)

    cy.get('[data-testid="applications-table"]').find('.actions-badge').first().click()
    cy.get(selectors.dashboardDropdownLink).should('exist')
  })

  it('My Apps – does not display metric cards or the analytics dropdown link if the feature flag is off', () => {
    cy.mockLaunchDarklyFlags([{ name: 'ma-1002-dev-portal-contextual-analytics', value: false }])

    cy.mockApplications(apps, 5)
    cy.visit('/my-apps')

    cy.get(selectors.metricCardsParent).should('not.exist')
    cy.get('[data-testid="applications-table"]').find('.actions-badge').first().click()
    cy.get(selectors.dashboardDropdownLink).should('not.exist')
  })

  it('My App details page – does not display Metrics Card, View Analytics button if the feature flag is off', () => {
    cy.mockLaunchDarklyFlags([{ name: 'ma-1002-dev-portal-contextual-analytics', value: true }])
    cy.mockApplications(apps, 4)

    cy.intercept(
      'GET',
      `**/api/v2/applications/${apps[0].id}`, {
        statusCode: 200,
        body: { ...apps[0] },
      },
    ).as('getSingleApplication')

    cy.mockApplicationWithCredAndReg(apps[0])

    cy.visit(`/application/${apps[0].id}`)
    cy.get('[data-testid="analytics-metric-cards"]').should('not.exist')
    cy.get('[data-testid="application-dashboard-button"]').should('not.exist')
  })

  it('App Dashboard - vitals elements load when contextual analytics feature flag is on', () => {
    cy.mockLaunchDarklyFlags([{ name: 'ma-1002-dev-portal-contextual-analytics', value: true }])
    cy.mockApplications(apps, 4)

    cy.intercept('GET', `**/api/v2/applications/${apps[0].id}`, {
      statusCode: 200,
      body: apps[0],
      delay: 0,
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
              size: 1,
            },
          },
        },
        delay: 0,
      },
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
})
