import { CredentialCreationResponse, GetApplicationResponse, ListCredentialsResponse, ListCredentialsResponseDataInner, ListRegistrationsResponse } from '@kong/sdk-portal-js'
import { product, versions, productRegistration, apps } from '../fixtures/consts'

const mockApplicationWithCredAndReg = (
  data: GetApplicationResponse,
  credentials: ListCredentialsResponseDataInner[] = [],
  registrations = []
) => {
  const applicationResponse: GetApplicationResponse = data

  cy.intercept('GET', `**/api/v2/applications/${data.id}`, {
    statusCode: 200,
    body: applicationResponse
  }).as('getApplication')

  const credsResponse: ListCredentialsResponse = {
    data: credentials,
    meta: {
      page: {
        total: credentials.length,
        size: 10,
        number: 1
      }
    }
  }

  cy.intercept('GET', `**/api/v2/applications/${data.id}/credentials*`, {
    statusCode: 200,
    body: credsResponse
  }).as('getApplicationCredentials')

  const registrationsResponse: ListRegistrationsResponse = {
    data: registrations,
    meta: {
      page: {
        total: registrations.length,
        size: 10,
        number: 1
      }
    }
  }

  cy.intercept('GET', `**/api/v2/applications/${data.id}/registrations*`, {
    statusCode: 200,
    body: registrationsResponse
  }).as('getApplicationRegistrations')
}

Cypress.Commands.add('createNewApplication', (app, productId, versions) => {
  const selectors = {
    appRegModal: '[data-testid="application-registration-modal"]'
  }

  const submitButton = 'button[type="submit"]'

  cy.viewport(1440, 900)
  cy.mockProductDocumentTree(productId)
  cy.mockProductDocument(productId)
  cy.mockApplications([], 0)
  cy.mockRegistrations(app.id)

  cy.mockProduct(productId, product, versions)
  cy.mockProductVersionSpec(productId, versions[0].id)
  cy.mockProductOperations(productId, versions[0].id, versions[0].operations)

  cy.mockProductVersionApplicationRegistration(versions[0])

  cy.intercept('POST', '**/api/v2/applications', {
    body: {
      id: '1'
    }
  }).as('postApplicationRegistration')

  cy.mockPrivatePortal()

  cy.visit(`/spec/${productId}`)
  cy.get('.swagger-ui', { timeout: 12000 })
  cy.get('[data-testid="register-button"]', { timeout: 12000 })
    .click({ force: true })
  cy.get(selectors.appRegModal).should('exist')
  cy.get('[data-testid="create-application"]').click()
  cy.get('header h1').should('contain', 'Create New Application')

  cy.mockApplications([app], 1)
  cy.mockPrivatePortal()

  cy.get(submitButton).should('be.disabled')
  cy.get('[data-testid="application-name-input"]').type(app.name, { delay: 0 })
  cy.get('[data-testid="reference-id-input"]').type(app.reference_id, { delay: 0 })
  cy.get(submitButton).should('not.be.disabled')
  cy.get(submitButton).click()

  cy.url().should('include', `/spec/${productId}`)

  return cy.document().then(document => {
    const params = (new URL(document.location.toString())).searchParams

    return params.get('application')
  })
})

describe('Application Registration', () => {
  const selectors = {
    appRegModal: '[data-testid="application-registration-modal"]'
  }

  const credentials: ListCredentialsResponseDataInner[] = [
    {
      id: '2433d1ba-1ba4-46d9-9c55-dde7cbcd8bd6',
      display_name: '4hloijU1YDWzeY003FKKZCeFUBNBXaxo'
    }
  ]

  const submitButton = 'button[type="submit"]'

  beforeEach(() => {
    cy.mockPrivatePortal()
    cy.mockAppearance()
    cy.mockStylesheetCss()
    cy.mockStylesheetFont()
    cy.mockContextualAnalytics()
  })

  it('displays empty dashboard for my apps', () => {
    cy.mockApplications([], 0)
    cy.visit('/my-apps')

    cy.get('[data-testid="create-application-button"]').should('exist')
    cy.get('[data-testid="create-application-link"]').should('exist')
    cy.get('[data-testid="empty-state-card"]')
      .should('exist')
      .should('contain', 'No Applications')
  })

  describe('Create Application', () => {
    it('can create a new applications from spec page', () => {
      mockApplicationWithCredAndReg(apps[0])
      cy.mockProductVersionAvailableRegistrations(product.id, versions[0].id, [])
      cy.mockApplications([apps[0]], 1)
      cy.createNewApplication(apps[0], product.id, versions)
    })
    it('can create an application with DCR for portal enabled', () => {
      cy.mockApplications([], 0)
      cy.mockDcrPortal()
      cy.visit('/my-apps')

      cy.get('[data-testid="create-application-button"]').should('exist')
      cy.get('[data-testid="create-application-link"]').should('exist')
      cy.get('[data-testid="create-application-button"]').click()

      cy.get('header h1').should('contain', 'Create New Application')
      cy.get(submitButton).should('be.disabled')
      cy.get('[data-testid="application-name-input"]').type(apps[3].name, { delay: 0 })
      cy.get('#description').type(apps[3].description, { delay: 0 })
      cy.get('#redirectUri').type(apps[3].redirect_uri, { delay: 0 })
      cy.get(submitButton).should('not.be.disabled')

      cy.intercept('POST', '**/api/v2/applications', {
        body: {
          id: apps[0].id,
          credentials: {
            client_id: 'your-client-id',
            client_secret: 'your-client-secret'
          }
        }
      }).as('postApplicationRegistration')
      mockApplicationWithCredAndReg(apps[3])
      mockApplicationWithCredAndReg(apps[0])

      cy.get(submitButton).click()



      cy.wait('@postApplicationRegistration').then(() => {
        cy.get('[data-testid="copy-secret-modal"]').should('exist')
        cy.get('[data-testid="copy-button"]').eq(0).should('exist').should('contain', 'your-client-id')
        cy.get('[data-testid="copy-button"]').eq(1).should('exist').should('contain', 'your-client-secret')
        cy.get('[data-testid="close-application-secret-modal"]').should('exist').click()

        cy.get('.k-alert.success').should('exist')
      })
    })
    it('can create a new application from my-appglo dashboard', () => {
      cy.mockApplications(apps, 4)
      cy.visit('/my-apps')

      cy.get('[data-testid="create-application-button"]').click()

      cy.get('header h1').should('contain', 'Create New Application')
      cy.get(submitButton).should('be.disabled')
      cy.get('[data-testid="application-name-input"]').type(apps[0].name, { delay: 0 })
      cy.get('#description').type(apps[0].description, { delay: 0 })
      cy.get('[data-testid="reference-id-input"]').type(apps[0].reference_id, { delay: 0 })
      cy.get(submitButton).should('not.be.disabled')

      cy.intercept('POST', '**/api/v2/applications', {
        body: {
          id: apps[0].id
        }
      }).as('postApplicationRegistration')
      mockApplicationWithCredAndReg(apps[0])

      cy.get(submitButton).click()

      cy.get('.k-alert.success').should('exist')
      cy.contains(apps[0].name)
      cy.contains(apps[0].description)
      cy.contains(apps[0].reference_id)
    })
    it('can generate reference Id via button', () => {
      cy.mockApplications(apps, 4)
      cy.visit('/my-apps')

      cy.get('[data-testid="create-application-button"]').click()

      cy.get('[data-testid="generate-reference-id"]').click()

      cy.get('[data-testid="reference-id-input"]').should('not.have.value', '')
    })
  })

  it('can return to My Apps from application details via breadcrumb', () => {
    cy.mockDeveloperRefresh()
    cy.mockApplications(apps, 4)
    // navigate directly to My Apps
    cy.visit('/my-apps')

    mockApplicationWithCredAndReg(apps[0])
    // go to application details
    cy.get('[data-testid="applications-table"] tbody tr')
      .contains(apps[0].name)
      .click()

    // use breadcrumb to navigate back to My Apps
    cy.get('.k-breadcrumbs .k-breadcrumbs-item a').contains('My Apps').click()
    cy.url().should('include', 'my-apps')
  })

  it('can edit an existing application', () => {
    cy.mockApplications(apps, 4)
    cy.visit('/my-apps')

    mockApplicationWithCredAndReg(apps[0])
    cy.get('[data-testid="applications-table"] tbody tr')
      .contains(apps[0].name)
      .click()

    cy.get('[data-testid="application-update-button"]').click()
    cy.get('header h1').should('contain', 'Update Application')

    cy.get('[data-testid="application-name-input"]').type('{end}z', { delay: 0 })

    cy.intercept('PATCH', `api/v2/applications/${apps[0].id}`, {
      statusCode: 200,
      body: { ...apps[0], name: apps[0].name + 'z' }
    }).as('getApplicationPatch')

    cy.intercept('GET', `api/v2/applications/${apps[0].id}`, {
      statusCode: 200,
      body: { ...apps[0], name: apps[0].name + 'z' }
    }).as('getApplication')

    cy.get(submitButton).click()
    cy.contains(apps[0].name + 'z')
  })
  it('can delete an existing application', () => {
    cy.mockApplications(apps, 4)
    cy.visit('/my-apps')

    mockApplicationWithCredAndReg(apps[0])

    cy.get('[data-testid="applications-table"] tbody tr')
      .should('have.length', 4)
      .contains(apps[0].name)
      .click()

    cy.get('[data-testid="application-update-button"]').click()
    cy.get('header h1').should('contain', 'Update Application')

    // Delete and cancel during confirmation
    cy.get('[data-testid="application-delete-button"]').click()
    cy.get('[data-testid="application-delete-modal"]').should('exist')
    cy.get('[data-testid="application-delete-cancel-button"]').click()
    cy.get('[data-testid="application-delete-modal"]').should('not.exist')

    cy.intercept('DELETE', `api/v2/applications/${apps[0].id}`, {
      statusCode: 200
    }).as('deleteApplication')

    cy.mockApplications([...apps.slice(1)], 2)

    // Delete and confirm deletion
    cy.get('[data-testid="application-delete-button"]').click()
    cy.get('[data-testid="application-delete-modal"]').should('exist')
    cy.get('[data-testid="application-delete-confirm-button"]').click()

    cy.get('.toaster-container-outer .message').should(
      'contain',
      'Application successfully deleted'
    )

    cy.get('[data-testid="applications-table"] tbody tr')
      .should('have.length', 3)
      .contains(apps[0].name)
      .should('not.exist')
  })

  describe('Credentials Management', () => {
    it("doesn't display unhashed credentials column", () => {
      cy.mockApplications(apps, 4)
      cy.visit('/my-apps')

      mockApplicationWithCredAndReg(apps[0], [credentials[0]])

      cy.get('[data-testid="applications-table"] tbody tr')
        .contains(apps[0].name)
        .click()

      cy.get('[data-testid="credentials-list"] thead th').should('exist').should('not.contain', 'API Key')
    })

    it('can create and copy credentials for application via modal', () => {
      cy.mockApplications(apps, 4)
      cy.visit('/my-apps')
      mockApplicationWithCredAndReg(apps[0])
      cy.get('[data-testid="applications-table"] tbody tr')
        .contains(apps[0].name)
        .click()

      cy.get('.credentials-list .empty-state-wrapper').should(
        'contain',
        'No Credentials'
      )

      const createCredResponseBody: CredentialCreationResponse = {
        credential: 'credentialKey',
        id: 'id',
        display_name: 'display-name'
      }

      cy.intercept('POST', `api/v2/applications/${apps[0].id}/credentials*`, {
        statusCode: 201,
        body: createCredResponseBody
      }).as('createApplicationCredentials')

      const credentialsResonse: ListCredentialsResponse = { data: [credentials[0]], meta: { page: { total: 1, size: 10, number: 1 } } }

      cy.intercept('GET', `api/v2/applications/${apps[0].id}/credentials*`, {
        statusCode: 200,
        body: credentialsResonse
      }).as('getApplicationCredentials')

      cy.get('[data-testid="generate-credential-button"]').click()
      cy.get('[data-testid="display-name-input"]').type('display-name').then(() => {
        cy.get('[data-testid="create-credential-modal-button"]').click()
        cy.wait('@createApplicationCredentials').then(() => {
          cy.get('[data-testid="copy-button"]').should('exist')
          cy.get('[data-testid="copy-credentials-confirm-modal-button"]').should('exist').click()
          cy.get('.toaster-container-outer .message').should(
            'contain',
            'copied to clipboard'
          )

          cy.get('[data-testid="credentials-list"] tbody tr')
            .should('exist')
            .should('have.length', 1)
        })
      })
    })
  })
  it('credential\'s display name is visible and editable, id is displayed', () => {
    cy.mockApplications(apps, 4)
    mockApplicationWithCredAndReg(apps[0], credentials)

    cy.visit('/my-apps')
    cy.get('[data-testid="applications-table"] tbody tr')
      .contains(apps[0].name)
      .click()

    cy.intercept('PUT', `api/v2/applications/${apps[0].id}/credentials/${credentials[0].id}`, {
      statusCode: 200,
      body: {}
    }).as('updateApplicationCredential')

    cy.wait('@getApplicationCredentials').then(() => {
      // Mock the update call
      cy.intercept('GET', `api/v2/applications/${apps[0].id}/credentials*`, {
        statusCode: 200,
        body: {
          data: [{
            id: credentials[0].id,
            key: credentials[0].display_name,
            display_name: 'new-display-name'
          }],
          meta: {
            page: {
              total: 1,
              size: 10,
              number: 1
            }
          }
        }
      })
      cy.get('[data-testid="credentials-list"] tbody tr')
        .should('exist')
        .should('have.length', 1)
      cy.get('[data-testid="action-badge"]').click()
      cy.get('.k-popover-content .rename-item').click()
      cy.get('[data-testid="display-name-modal"]').should('exist')
      cy.get('[data-testid="rename-display-name-input"]').type('new-display-name{enter}')

      cy.wait('@updateApplicationCredential').then(() => {
        cy.get('[data-testid="credentials-list"] tbody tr').contains('new-display-name')
      })
    })
  })

  it('can create and delete credentials for application', () => {
    cy.mockApplications(apps, 4)
    cy.visit('/my-apps')

    mockApplicationWithCredAndReg(apps[0])

    cy.get('[data-testid="applications-table"] tbody tr')
      .contains(apps[0].name)
      .click()

    cy.get('.credentials-list .empty-state-wrapper').should(
      'contain',
      'No Credentials'
    )

    cy.intercept('POST', `api/v2/applications/${apps[0].id}/credentials*`, {
      statusCode: 201,
      body: {
        credential: 'credentialKey',
        id: 'id',
        display_name: 'display-name'
      }
    }).as('createApplicationCredentials')

    cy.intercept('GET', `api/v2/applications/${apps[0].id}/credentials*`, {
      statusCode: 200,
      body: { data: [credentials[0]], meta: { page: { total: 1, size: 10, number: 1 } } }
    }).as('getApplicationCredentials')

    cy.get('[data-testid="generate-credential-button"]').click()
    cy.get('[data-testid="display-name-input"]').type('display-name').then(() => {
      cy.get('[data-testid="create-credential-modal-button"]').click()
      cy.wait('@createApplicationCredentials').then(() => {
        cy.get('[data-testid="copy-button"]').should('exist')
        cy.get('[data-testid="copy-credentials-confirm-modal-button"]').should('exist').click()
        cy.get('.toaster-container-outer .message').should(
          'contain',
          'copied to clipboard'
        )

        cy.get('[data-testid="credentials-list"] tbody tr')
          .should('exist')
          .should('have.length', 1)
      })

      cy.intercept(
        'DELETE',
        `api/v2/applications/${apps[0].id}/credentials/${credentials[0].id}`,
        {
          statusCode: 200
        }
      ).as('deleteApplicationCredentials')

      cy.intercept('GET', `api/v2/applications/${apps[0].id}/credentials*`, {
        statusCode: 200,
        body: { data: [], meta: { page: { total: 0, size: 10, number: 1 } } }
      }).as('getApplicationCredentials')

      cy.get('[data-testid="action-badge"]').click()
      cy.get('.k-popover-content .delete-item').click({ force: true })
      cy.get('[data-testid="revoke-credential-modal"]').should('exist')
      cy.get('[data-testid="revoke-credential-modal-button"]').should('exist').click()
      cy.get('.credentials-list .empty-state-wrapper').should(
        'contain',
        'No Credentials'
      )
    })
  })

  describe('Registration Management', () => {
    it('can request registration to a product', () => {
      cy.mockProductDocument()
      cy.mockProduct()
      cy.mockProductVersionApplicationRegistration(versions[0])
      cy.mockGetProductDocuments(product.id)
      cy.mockProductOperations(product.id, versions[0].id)
      cy.mockProductVersionSpec(product.id, versions[0].id)
      cy.mockRegistrations('*', []) // mock with empty so that we add one.

      cy.viewport(1440, 900)
      cy.visit(`/spec/${product.id}`)
      cy.get('.swagger-ui', { timeout: 12000 })

      cy.mockApplications(apps, 4)
      cy.mockProductVersionAvailableRegistrations(product.id, versions[0].id, apps)

      cy.get('[data-testid="register-button"]', { timeout: 12000 }).click()
      cy.get(selectors.appRegModal).should('exist')
      cy.get(`${selectors.appRegModal} [data-testid="register-${apps[0].name}"]`).should('contain', apps[0].name).click()

      const mockCreateRegResponse = {
        ...productRegistration,
        status: 'pending',
        application: apps[0]
      }

      cy.intercept(
        'POST',
        `/api/v2/applications/${apps[0].id}/registrations*`,
        {
          body: mockCreateRegResponse
        }
      ).as('postApplicationRegistration')

      cy.get('[data-testid="submit-registration"]').click()
      cy.get(selectors.appRegModal).should(
        'contain',
        'You will be notified upon approval'
      )
    })

    it('can request registration to a product and is directed to application upon auto_approval', () => {
      cy.mockProductDocument()
      cy.mockProduct()
      cy.mockProductVersionApplicationRegistration(versions[0])
      cy.mockGetProductDocuments(product.id)
      cy.mockProductOperations(product.id, versions[0].id)
      cy.mockProductVersionSpec(product.id, versions[0].id)
      cy.mockRegistrations('*', [])

      cy.viewport(1440, 900)
      cy.visit(`/spec/${product.id}`)

      cy.mockApplications(apps, 4)
      cy.mockProductVersionAvailableRegistrations(product.id, versions[0].id, apps)

      cy.get('[data-testid="register-button"]', { timeout: 12000 }).click()
      cy.get(selectors.appRegModal).should('exist')
      cy.get(`${selectors.appRegModal} [data-testid="register-${apps[0].name}"]`).should('contain', apps[0].name).click()

      cy.intercept(
        'POST',
        `/api/v2/applications/${apps[0].id}/registrations*`,
        {
          body: productRegistration
        }
      ).as('postApplicationRegistration')

      mockApplicationWithCredAndReg(apps[1], [], [productRegistration])

      cy.get('[data-testid="submit-registration"]').click()

      cy.get('[data-testid="products-list"]')
      cy.get('[data-testid="products-list"]').should('contain', 'barAPI')
      cy.get('[data-testid="status-badge"]').should('contain', 'approved')
    })

    it('cannot duplicate a registration request', () => {
      cy.mockProductDocument()
      cy.mockProduct()
      cy.mockProductVersionApplicationRegistration(versions[0])
      cy.mockGetProductDocuments(product.id)
      cy.mockProductOperations(product.id, versions[0].id)
      cy.mockProductVersionSpec(product.id, versions[0].id)
      cy.mockRegistrations('*', [])

      cy.viewport(1440, 900)
      cy.visit(`/spec/${product.id}`)

      cy.mockApplications(apps, 3)
      cy.mockProductVersionAvailableRegistrations(product.id, versions[0].id, [apps[2]])

      cy.get('[data-testid="register-button"]', { timeout: 12000 }).click()
      cy.get(selectors.appRegModal).should('exist')
      cy.get(`${selectors.appRegModal} [data-testid="register-${apps[0].name}"]`).should('not.exist')
      cy.get(`${selectors.appRegModal} [data-testid="register-${apps[1].name}"]`).should('not.exist')
      cy.get(`${selectors.appRegModal} [data-testid="register-${apps[2].name}"]`).should('exist')
    })
  })

  it("can't refresh token of existing application without dcr", () => {
    cy.mockApplications([apps[0]], 1)
    cy.visit('/my-apps')

    cy.get('[data-testid="applications-table"] tbody tr .actions-badge')
      .should('have.length', 1)
      .click()

    cy.get('[data-testid="dropdown-refresh-application-dcr-token"]').should('not.exist')
    cy.get('[data-testid="dropdown-delete-application"]').should('exist')
  })

  it('show credentials table and not dcr secret table if portal is not dcr ', () => {
    cy.mockApplications([{ ...apps[0] }], 1)
    mockApplicationWithCredAndReg({ ...apps[0] })

    cy.intercept('GET', '**/api/v2/portal', {
      dcr_provider_ids: []
    }).as('getPortalContext')

    cy.visit('/my-apps')

    cy.get('[data-testid="applications-table"] tbody tr').click()

    cy.wait('@getPortalContext')

    cy.intercept('POST', `api/v2/applications/${apps[0].id}/refresh-token`, {
      statusCode: 200,
      body: { client_secret: 'SECRET_TOKEN' }
    }).as('refreshToken')

    cy.get('[data-testid="client-secret-table"]').should('not.exist')
    cy.get('[data-testid="client-secret-table"] [data-testid="refresh-secret-button"]').should('not.exist')
    cy.get('.credentials-list').should('exist')
  })

  describe('Credential management with DCR', () => {
    it('can refresh token of existing application with dcr', () => {
      cy.mockDcrPortal()
      cy.mockApplications([{ ...apps[0] }], 1)
      cy.visit('/my-apps')

      cy.get('[data-testid="applications-table"] tbody tr .actions-badge')
        .should('have.length', 1)
        .click()

      cy.intercept('POST', `api/v2/applications/${apps[0].id}/refresh-token`, {
        statusCode: 200,
        body: { client_secret: 'SECRET_TOKEN' }
      }).as('refreshToken')

      cy.get('[data-testid="dropdown-delete-application"]').should('exist')
      cy.get('[data-testid="dropdown-refresh-application-dcr-token"]').should('exist').click()

      cy.wait('@refreshToken')

      cy.get('.toaster-container-outer .message').should(
        'contain',
        'Successfully refreshed secret'
      )

      cy.get('[data-testid="application-secret-token-modal"]').should('exist')
      cy.get('[data-testid="copy-button"]').should('contain', 'SECRET_TOKEN').click()

      cy.get('.toaster-container-outer .message').should(
        'contain',
        '"SECRET_TOKEN" copied to clipboard'
      )

      cy.get('[data-testid="close-btn"]').click()

      cy.get('[data-testid="application-secret-token-modal"]').should('not.exist')
    })

    it('can refresh token of existing application with dcr from application page', () => {
      cy.mockApplications([{ ...apps[0], created_at: '2022-11-02T18:59:30.789Z' }], 1)
      mockApplicationWithCredAndReg({ ...apps[0], created_at: '2022-11-02T18:59:30.789Z' })
      cy.mockDcrPortal()
      cy.visit('/my-apps')

      cy.get('[data-testid="applications-table"] tbody tr').click()

      cy.intercept('POST', `api/v2/applications/${apps[0].id}/refresh-token`, {
        statusCode: 200,
        body: { client_secret: 'SECRET_TOKEN' }
      }).as('refreshToken')

      cy.wait('@isDcrPortal')

      cy.get('[data-testid="client-secret-table"]').should('exist')
      cy.get('[data-testid="client-secret-table"] [data-testid="refresh-secret-button"]').should('exist').click()

      cy.wait('@refreshToken')

      cy.get('.toaster-container-outer .message').should(
        'contain',
        'Successfully refreshed secret'
      )

      cy.get('[data-testid="application-secret-token-modal"]').should('exist')
      cy.get('[data-testid="copy-button"]').should('contain', 'SECRET_TOKEN').click()

      cy.get('.toaster-container-outer .message').should(
        'contain',
        '"SECRET_TOKEN" copied to clipboard'
      )

      cy.get('[data-testid="close-btn"]').click()

      cy.get('[data-testid="application-secret-token-modal"]').should('not.exist')
    })
  })
})
