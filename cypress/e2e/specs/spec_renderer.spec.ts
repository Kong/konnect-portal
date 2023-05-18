import { product as servicePackage, versions } from '../fixtures/consts'
import petstoreJson from '../fixtures/oas_specs/petstoreJson.json'
import petstoreJson3 from '../fixtures/oas_specs/petstoreJson3.0.json'

describe('Spec Renderer Page', () => {
  describe('Spec Render Yaml', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
      cy.mockServiceDocument()
      cy.mockServicePackage()
      cy.mockServicePackageDocumentTree()
      cy.mockServiceOperations()
      cy.mockProductVersionSpec()
    })

    it('can return to Catalog from spec details via breadcrumb', () => {
      cy.visit(`/spec/${servicePackage.id}`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })

      cy.get('.k-breadcrumbs .k-breadcrumbs-item a[href="/"]').should('contain', 'Catalog')
      cy.get('.k-breadcrumbs .k-breadcrumbs-item a[href="/"]').contains('Catalog').click()
      cy.url().should('not.include', 'spec')
    })

    it('renders page', () => {
      cy.mockServiceVersionApplicationRegistration(versions[0])

      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.version-select-dropdown').should('contain', 'v1-beta')
        // loads swagger title
        .get('.info h2').should('contain', 'Swagger Petstore')
        // loads swagger description
        .get('.info').should('contain', 'This comes from the spec')
    })

    it('raw button', () => {
      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        // displays view spec modal
        .get('kong-swagger-ui').shadow().find('.actions button.btn-outline').click()
        .get('.view-spec-modal .modal-header').should('contain', 'View Spec')
        // copies spec when copy button clicked
        .get('.view-spec-modal .modal-footer button')
        .contains('Copy')
        .click()
        .get('.toaster-container-outer .message').should(
          'contain',
          'Copied to clipboard'
        )
        // closes spec modal when close button clicked View Raw
        .get('.view-spec-modal .modal-footer button')
        .contains('Close')
        .click()
        .get('.view-spec-modal').should('not.be.visible')
    })

    it('loads page title and url is correct', () => {
      cy.visit(`/spec/${servicePackage.id}`)
      cy.get('.info') // here to make sure we wait for load
      cy.title().should('eq', 'barAPI - v1-beta | Developer Portal')
    })
  })

  describe('Spec Render Json', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
      cy.mockServiceDocument()
      cy.mockServicePackage()
      cy.mockServicePackageDocumentTree()
      cy.mockServiceOperations()
      cy.mockProductVersionSpec()
    })

    it('renders page', () => {
      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        // loads version text
        .get('.version-select-dropdown').should('contain', 'v1-beta')
        // loads swagger title
        .get('.info h2').should('contain', 'Swagger Petstore')
        // loads swagger description
        .get('.info').should('contain', 'This comes from the spec')
    })

    it('raw button', () => {
      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        // displays view spec modal
        .get('kong-swagger-ui').shadow().find('.actions button.btn-outline').click()
        .get('.view-spec-modal .modal-header').should('contain', 'View Spec')
        // copies spec when copy button clicked
        .get('.view-spec-modal .modal-footer button')
        .contains('Copy')
        .click()
        .get('.toaster-container-outer .message').should(
          'contain',
          'Copied to clipboard'
        )
        // closes spec modal when close button clicked
        .get('.view-spec-modal .modal-footer button')
        .contains('Close')
        .click()
        .get('.view-spec-modal').should('not.be.visible')
    })
  })

  describe('Spec Render OAS3 ', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
      cy.mockServiceDocument('*', '*', { body: petstoreJson3 })
      cy.mockServicePackage()
      cy.mockServicePackageDocumentTree()
      cy.mockServiceOperations()
      cy.mockProductVersionSpec()
    })

    it('renders page', () => {
      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        // loads version text
        .get('.version-select-dropdown').should('contain', 'v1-beta')
        // loads swagger title
        .get('.info h2').should('contain', 'Swagger Petstore')
        // loads swagger description
        .get('.info').should('contain', 'This comes from the spec')

      cy.get('#operations-pet-updatePet').click()
      cy.get('.opblock-description > .renderedMarkdown > p').should('contain', 'Update an existing pet by Id')
    })
  })

  describe('Multiple Versions', () => {
    const weirdVersionName = 'weird <> % $ `'

    const v2BetaVersion = {
      created_at: '2022-03-24T14:52:46.323Z',
      updated_at: '2022-03-27T14:52:46.323Z',
      id: '2afac832-5b2a-474c-a56d-c241364f41cf',
      version: 'v2-beta',
      publish_status: 'published',
      registration_configs: [],
      deprecated: false
    }

    const weirdVersion = {
      created_at: '2022-03-24T13:52:46.323Z',
      updated_at: '2022-03-24T13:52:46.323Z',
      id: '2afac832-4b2a-474c-a56d-c241364f41cf',
      version: weirdVersionName,
      publish_status: 'published',
      registration_configs: [],
      deprecated: false
    }
    const servicePackageBody = {
      ...servicePackage
    }

    const mockedVersions = [
      ...versions,
      weirdVersion,
      v2BetaVersion
    ]

    const serviceDocumentPetttstorrreeeBody = {
      ...petstoreJson,
      info: {
        ...petstoreJson.info,
        title: 'Petttstorrreee',
        description: 'This is petstore json, not to be confused with petstore yaml'
      }
    }
    const serviceDocumentWeirdPetStoreBody = {
      ...petstoreJson,
      info: {
        ...petstoreJson.info,
        title: 'weird petstore',
        description: 'This is petstore weird, not to be confused with petstore yaml'
      }
    }

    beforeEach(() => {
      cy.mockPrivatePortal()
      cy.mockServiceVersionApplicationRegistration(versions[0])
      cy.mockServiceOperations()
      cy.mockGetServicePackageDocumentTree()
      cy.mockProductVersionSpec()
    })

    it('loads a new spec when selected from the dropdown', () => {
      cy.mockServicePackage(servicePackage.id, servicePackageBody, mockedVersions)
      cy.mockServiceDocument(servicePackage.id, v2BetaVersion.id, {
        body: serviceDocumentPetttstorrreeeBody
      })
      cy.visit(`/spec/${servicePackage.id}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })

      cy.get('.info h2').should('contain', 'Swagger Petstore')
        .get('.info').contains('This comes from the spec')
        .title().should('eq', 'barAPI - v1-beta | Developer Portal')
        .url().should('include', versions[0].id)

      cy.mockProductVersionSpec('*', '*', JSON.stringify(serviceDocumentPetttstorrreeeBody))

      cy.get('.version-select-dropdown').click()
        .get('.version-select-dropdown').contains('v2-beta').click()
        .wait(2000)

      cy.get('.info h2').should('contain', 'Petttstorrreee')
        .get('.info').contains('This is petstore json, not to be confused with petstore yaml')
        .title().should('eq', 'barAPI - v2-beta | Developer Portal')
        .url().should('include', v2BetaVersion.id)

      cy.mockServicePackage(servicePackage.id, servicePackageBody, mockedVersions)

      cy.mockProductVersionSpec()
      cy.go('back') // back button works
      cy.mockServiceOperations()
      cy.mockServiceDocument()
      cy.mockGetServicePackageDocumentTree()
        .wait(1000)

      cy.get('.info h2').should('contain', 'Swagger Petstore')
        .get('.info').contains('This comes from the spec')
    })

    it('supports navigating to version using name', () => {
      cy.mockServicePackage(servicePackage.id, servicePackageBody, mockedVersions)

      cy.visit(`/spec/${servicePackage.id}/v1-beta`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Swagger Petstore')
        .get('.info').contains('This comes from the spec')
        .title().should('eq', 'barAPI - v1-beta | Developer Portal')

      cy.mockProductVersionSpec('*', '*', JSON.stringify(serviceDocumentPetttstorrreeeBody))

      cy.visit(`/spec/${servicePackage.id}/v2-beta`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Petttstorrreee')
        .get('.info').contains('This is petstore json, not to be confused with petstore yaml')
        .title().should('eq', 'barAPI - v2-beta | Developer Portal')
    })

    it('supports navigating to version using uuid', () => {
      cy.mockServicePackage(servicePackage.id, servicePackageBody, mockedVersions)

      cy.visit(`/spec/${servicePackage.id}/${versions[0].id}`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Swagger Petstore')
        .get('.info').contains('This comes from the spec')
        .title().should('eq', 'barAPI - v1-beta | Developer Portal')

      cy.mockProductVersionSpec('*', '*', JSON.stringify(serviceDocumentPetttstorrreeeBody))

      cy.visit(`/spec/${servicePackage.id}/${v2BetaVersion.id}`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Petttstorrreee')
        .get('.info').contains('This is petstore json, not to be confused with petstore yaml')
        .title().should('eq', 'barAPI - v2-beta | Developer Portal')
    })

    it('double UriComponent encodes the version', () => {
      cy.mockServiceVersionApplicationRegistration(weirdVersion)
      cy.mockServiceOperations()
      cy.mockGetServicePackageDocumentTree()
      cy.mockServicePackage(servicePackage.id, servicePackageBody, mockedVersions)

      cy.mockProductVersionSpec('*', '*', JSON.stringify(serviceDocumentWeirdPetStoreBody))

      cy.visit(`/spec/${servicePackage.id}/${encodeURIComponent(encodeURIComponent(weirdVersionName))}`)
        .get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'weird petstore')
        .title().should('eq', `barAPI - ${weirdVersionName} | Developer Portal`)

      cy.mockServicePackage(servicePackage.id, servicePackageBody)

      cy.mockProductVersionSpec()

      cy.get('.version-select-dropdown').click()
        .get('.version-select-dropdown').contains('v1-beta').click()
        .wait(2000)
        .get('.info h2').should('contain', 'Swagger Petstore')
        .url().should('include', versions[0].id)

      cy.mockServicePackage(servicePackage.id, servicePackageBody)

      cy.mockProductVersionSpec('*', '*', JSON.stringify(serviceDocumentWeirdPetStoreBody))

      cy.get('.version-select-dropdown').click()
        .get('.version-select-dropdown').contains(weirdVersionName).click()
        .wait(2000)
        .get('.info h2').should('contain', 'weird petstore')
        .title().should('eq', `barAPI - ${weirdVersionName} | Developer Portal`)
        .url().should('include', weirdVersion.id)
    })
  })

  describe('Spec Render permissions', () => {
    beforeEach(() => {
      cy.mockPrivatePortal()
      cy.mockServiceDocument()
      cy.mockServicePackage()
      cy.mockProductVersionSpec()
      cy.mockServiceVersionApplicationRegistration(versions[0])
    })

    it('redirects to 403 page when developer does not have permissions to see the spec', () => {
      cy.intercept('GET', '**/api/v2/portal', {
        rbac_enabled: true
      }).as('getPortalContext')

      cy.intercept('GET', 'api/v2/portals/*/developers/me/permissions', {
        statusCode: 200,
        body: [{
          resource: 'krn:konnect:reg/*:org/*:portals/*/services/*',
          actions: []
        }],
        delay: 300
      }).as('getPermissions')

      cy.visit(`/spec/${servicePackage.id}`)

      cy.wait('@getPermissions')

      cy.get('[data-testid="forbidden"]').should('exist')
    })

    it('allow to register and see spec when rbac enabled and permission granted', () => {
      cy.intercept('GET', '**/api/v2/portal', {
        rbac_enabled: true
      }).as('getPortalContext')

      cy.intercept('GET', 'api/v2/portals/*/developers/me/permissions', {
        statusCode: 200,
        body: [{
          resource: 'krn:konnect:reg/*:org/*:portals/*/services/*',
          actions: [
            '#view',
            '#consume'
          ]
        }],
        delay: 300
      }).as('getPermissions')

      cy.visit(`/spec/${servicePackage.id}`)

      cy.wait('@getPermissions')

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Swagger Petstore')

      cy.get('[data-testid="register-button"]').should('exist')
    })

    it('does not call developers/me/permissions if rbac not enabled', () => {
      cy.intercept('GET', '**/api/v2/portal', {
        rbac_enabled: false
      }).as('getPortalContext')

      cy.intercept('get', 'api/v2/portals/*/developers/me/permissions', cy.spy().as('apiNotCalled'))

      cy.visit(`/spec/${servicePackage.id}`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Swagger Petstore')

      cy.get('[data-testid="register-button"]').should('exist')

      cy.get('@apiNotCalled').should('not.been.called')
    })
  })

  describe('Spec Render permissions public', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      cy.mockServiceDocument()
      cy.mockServicePackage()
      cy.mockProductVersionSpec()
      cy.mockServiceVersionApplicationRegistration(versions[0])
    })

    it('allows seeing spec when portal is public and rbac enabled, does not call developers/me/permissions', () => {
      cy.intercept('GET', '**/portal_api/portal/portal_context', {
        rbac_enabled: true
      }).as('getPortalContext')

      cy.intercept('get', 'api/v2/portals/*/developers/me/permissions', cy.spy().as('apiNotCalled'))

      cy.visit(`/spec/${servicePackage.id}`)

      cy.get('[data-testid="kong-public-ui-spec-details-swagger"]', { timeout: 12000 })
        .get('.info h2').should('contain', 'Swagger Petstore')

      cy.get('@apiNotCalled').should('not.been.called')
    })
  })
})
