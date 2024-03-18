import petstoreJson from '../fixtures/oas_specs/petstoreJson.json'
import petstoreJson30 from '../fixtures/oas_specs/petstoreJson3.0.json'
import { generateProducts } from './utils/generateProducts'
import { generateDocuments } from './utils/generateDocuments'
import { defaultContext, product, versions } from '../fixtures/consts'
import document from '../fixtures/dochub_mocks/document.json'
import documentTreeJson from '../fixtures/dochub_mocks/documentTree.json'
import apiDocumentationJson from '../fixtures/dochub_mocks/parentApiDocumentation.json'
import petstoreOperationsV2 from '../fixtures/v2/petstoreOperations.json'
import {
  GetApplicationResponse,
  ListApplicationsResponse,
  ListAuthStrategiesResponse,
  ListCredentialsResponse,
  ListDocumentsTree,
  ListRegistrationsResponse,
  PortalAppearance,
  PortalContext,
  Product,
  ProductDocument,
  ProductDocumentRaw,
  ProductVersion,
  ProductVersionListPage,
  ProductVersionSpecDocument,
  ProductVersionSpecOperations,
  ProductVersionSpecOperationsOperationsInner,
  SearchResults
} from '@kong/sdk-portal-js'
import { THEMES } from '../fixtures/theme.constant'

Cypress.Commands.add('mockStylesheetCss', (theme = 'mint_rocket', fonts = {
  base: 'Roboto',
  headings: 'Lato',
  code: 'Roboto Mono'
}) => {
  return cy.readFile(`cypress/e2e/fixtures/theme_stylesheets/${theme}.css`).then(css => {
    return cy.intercept('GET', '/api/v2/portal/stylesheet.css', {
      status: 200,
      body: css.replace(/{{baseFont}}/g, fonts.base).replace(/{{headingsFont}}/g, fonts.headings).replace(/{{codeFont}}/g, fonts.code),
      headers: {
        'content-type': 'text/css'
      }
    }).as('mockStylesheet')
  })
})

Cypress.Commands.add('mockAppearance', (appearance = {}) => {
  const defaultAppearance: PortalAppearance = {
    variables: {
      catalog: {
        cover: {
          url: ''
        },
        logo: {
          url: ''
        },
        primary_header: {
          text: ''
        },
        welcome_message: {
          text: ''
        }
      }
    },
    stylesheets: {
      global: {
        main: {
          data: THEMES.mint_rocket
        }
      }
    }
  }

  cy.mockLogo()
  cy.mockCatalogCover()

  cy.intercept('GET', '**/api/v2/portal/appearance', {
    statusCode: 200,
    body: {
      ...defaultAppearance,
      ...appearance
    }
  }).as('getAppearance')
})

Cypress.Commands.add('mockCatalogCover', () => {
  cy.intercept('GET', '**/api/v2/portal/catalog-cover', {
    fixture: 'images/kong-logo.png'
  }).as('getCatalogCover')
})

Cypress.Commands.add('mockLogo', () => {
  cy.intercept('GET', '**/api/v2/portal/logo', {
    fixture: 'images/kong-logo.png'
  }).as('getLogo')
})

Cypress.Commands.add('mockStylesheetFont', (fonts = {
  base: 'Roboto',
  headings: 'Lato',
  code: 'Roboto Mono'
}) => {
  cy.intercept('GET', `https://fonts.googleapis.com/css?family=${fonts.base}*`, {
    statusCode: 200,
    body: `@font-face {font-family: '${fonts.base}';font-style: italic;font-weight: 300;font-display: swap;src: url(https://fonts.gstatic.com/s/lato/v24/S6u_w4BMUTPHjxsI9w2_FQftx9897sxZ.woff2) format('woff2');unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}`,
    headers: {
      'content-type': 'text/css'
    }
  })
  cy.intercept('GET', `https://fonts.googleapis.com/css?family=${fonts.headings}*`, {
    statusCode: 200,
    body: `@font-face {font-family: '${fonts.headings}';font-style: italic;font-weight: 300;font-display: swap;src: url(https://fonts.gstatic.com/s/lato/v24/S6u_w4BMUTPHjxsI9w2_FQftx9897sxZ.woff2) format('woff2');unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}`,
    headers: {
      'content-type': 'text/css'
    }
  })
  cy.intercept('GET', `https://fonts.googleapis.com/css?family=${fonts.code}*`, {
    statusCode: 200,
    body: `@font-face {font-family: '${fonts.code}';font-style: italic;font-weight: 300;font-display: swap;src: url(https://fonts.gstatic.com/s/lato/v24/S6u_w4BMUTPHjxsI9w2_FQftx9897sxZ.woff2) format('woff2');unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}`,
    headers: {
      'content-type': 'text/css'
    }
  })

  return cy.intercept('GET', '/api/v2/portal/stylesheet/font.css', {
    status: 200,
    body: `@import url('https://fonts.googleapis.com/css?family=${fonts.base}:300,300i,400,400i,500,500i,700,700i&display=swap');@import url('https://fonts.googleapis.com/css?family=${fonts.headings}:300,300i,400,400i,500,500i,700,700i&display=swap');@import url('https://fonts.googleapis.com/css?family=${fonts.code}:300,300i,400,400i,500,500i,700,700i&display=swap');`,
    headers: {
      'content-type': 'text/css'
    }
  }).as('mockStylesheetFont')
})

Cypress.Commands.add('mockPrivatePortal', (overrideContext = {}) => {
  // handles things like stylesheet and favicon requests
  cy.intercept('GET', '**/api/v2/portal/*', {
    statusCode: 200
  })

  const portalContextResponse: PortalContext = {
    ...defaultContext,
    ...overrideContext
  }

  return cy.intercept('GET', '**/api/v2/portal', {
    statusCode: 200,
    body: portalContextResponse,
    delay: 300
  }).as('isPublicPortal')
})

Cypress.Commands.add('mockPublicPortal', () => {
  const portalContextResponse: PortalContext = {
    ...defaultContext,
    is_public: true
  }

  return cy.intercept('GET', '**/api/v2/portal', {
    statusCode: 200,
    body: portalContextResponse,
    delay: 300
  }).as('isMockedPublicPortal')
})

Cypress.Commands.add('mockSuccessfulDeveloperAuth', () => {
  return cy.intercept('POST', '**/developer/authenticate', {
    statusCode: 204,
    body: {},
    delay: 300
  }).as('userAuthenticate')
})
Cypress.Commands.add('mockDeveloperRefresh', () => {
  return cy.intercept('POST', '**/developer/refresh', {
    statusCode: 204,
    body: {},
    delay: 300
  }).as('developerRefresh')
})

Cypress.Commands.add('mockSuccessfulPasswordReset', () => {
  return cy.intercept('POST', '**/api/v2/developer/forgot-password', {
    statusCode: 200,
    delay: 300
  }).as('sendPasswordReset')
})

Cypress.Commands.add('mockDeveloperLogout', () => {
  return cy.intercept('POST', '**/api/v2/developer/logout', {
    statusCode: 200,
    delay: 300
  }).as('developerLogout')
})

Cypress.Commands.add('mockGetUserInfo', () => {
  return cy.intercept('GET', '**/api/v2/developer/me', {
    statusCode: 200,
    body: {
      created_at: '2022-12-06T21:37:15Z',
      full_name: 'test-name',
      id: '967ca69f-e098-46d1-a572-2e8c73aeb807',
      email: 'test-email@email.com',
      updated_at: '2023-04-13T15:05:02Z'
    },
    delay: 300
  }).as('getUserInfo')
})

Cypress.Commands.add('mockProductDocument', (productId = '*', documentId = '*', options = { body: petstoreJson }) => {
  const documentTreeResponse: ProductDocumentRaw = {
    content: JSON.stringify(options.body),
    id: documentId,
    slug: 'petstore',
    title: 'Petstore',
    parent_document_id: null
  }

  return cy.intercept('GET', `**/api/v2/products/${productId}/documents/${documentId}`, {
    statusCode: 200,
    delay: 100,
    body: documentTreeResponse
  }).as('getMockedServiceDocument')
})

Cypress.Commands.add('mockProductDocumentTree', (productId = '*', options = { body: documentTreeJson }) => {
  const documentTreeResponse: ListDocumentsTree = {
    data: options.body,
    meta: {
      page: {
        number: 1,
        size: 10,
        total: 1
      }
    }
  }

  return cy.intercept('GET', `**/api/v2/products/${productId}/documents`, {
    statusCode: 200,
    delay: 100,
    body: documentTreeResponse
  }).as('getMockProductDocumentTree')
})

Cypress.Commands.add('mockProductApiDocument', (productId = '*', options = { body: apiDocumentationJson }) => {
  const productDocumentResponse: ProductDocument = options.body

  return cy.intercept('GET', `**/api/v2/products/${productId}/documents/${productDocumentResponse.slug}`, {
    statusCode: 200,
    delay: 100,
    body: productDocumentResponse
  }).as('getMockProductApiDocument')
})

Cypress.Commands.add('mockProduct', (productId = '*', mockProduct = product, mockVersions = versions) => {
  const versionsResponse: ProductVersionListPage = {
    data: mockVersions,
    meta: {
      page: {
        total: 1, number: 1, size: 10
      }
    }
  }

  cy.intercept('GET', `**/api/v2/products/${productId}/versions**`, {
    statusCode: 200,
    delay: 100,
    body: versionsResponse
  }).as('getProductVersions')

  const productResponse: Product = {
    ...mockProduct
  }

  return cy.intercept('GET', `**/api/v2/products/${productId}`, {
    statusCode: 200,
    delay: 100,
    body: productResponse
  }).as('getProduct')
})

Cypress.Commands.overwrite('visit', (originalFn, ...options) => {
  if (options[1] && options[1].useOriginalFn) {
    originalFn(...options)
  } else {
    const developer = {
      id: '9ee6f0ef-35c2-495c-bb7b-836af45e1a6d',
      email: '62cd14@email.com'
    }

    window.localStorage.setItem(
      'konnect_portal_session',
      btoa(encodeURIComponent(JSON.stringify({ developer })))
    )

    cy.setCookie('CYPRESS_USER_SESSION_EXISTS', 'CYPRESS_USER_SESSION_EXISTS')

    cy.log('Visit with logged user')

    originalFn(...options)
  }
})

Cypress.Commands.add('mockApplications', (applications, totalCount, pageSize = 1, pageNumber = 10) => {
  const responseBody: ListApplicationsResponse = {
    data: applications,
    meta: {
      page: {
        total: totalCount,
        number: pageNumber,
        size: pageSize

      }
    }
  }

  return cy.intercept('GET', '**/api/v2/applications*', {
    body: responseBody
  }).as('getApplications')
})

Cypress.Commands.add('mockApplicationAuthStrategies', (applicationAuthStrategies, totalCount, pageSize = 1, pageNumber = 10) => {
  const responseBody: ListAuthStrategiesResponse = {
    data: applicationAuthStrategies,
    meta: {
      page: {
        total: totalCount,
        number: pageNumber,
        size: pageSize

      }
    }
  }

  return cy.intercept('GET', '**/api/v2/applications/auth-strategies*', {
    body: responseBody
  }).as('getApplicationAuthStrategies')
})

Cypress.Commands.add('mockRegistrations', (applicationId = '*', registrations = [], pageNumber = 1, pageSize = 10, totalCount = 0) => {
  return cy.intercept('GET', `**/api/v2/applications/${applicationId}/registrations*`, {
    body: {
      data: registrations,
      meta: {
        page: {
          total: totalCount,
          number: pageNumber,
          size: pageSize
        }
      }
    },
    status: 200
  }).as('getRegistrations')
})

Cypress.Commands.add('mockApplicationWithCredAndReg', (
  data: GetApplicationResponse,
  credentials = [],
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
})

Cypress.Commands.add('mockContextualAnalytics', () => {
  return cy.intercept(
    'POST', '**/api/v2/stats', {
      statusCode: 200,
      body: { records: [] },
      delay: 0
    }).as('getContextualAnalytics')
})

Cypress.Commands.add('mockProductVersionApplicationRegistration', (version, config = {}) => {
  return cy.intercept(
    'GET',
    `**/api/v2/application_registrations/product_versions/${version.id}`, {
      body: {
        auth_config: { name: 'key-auth', config: {} },
        auto_approve: false,
        created_at: '2022-03-25T10:56:27.268Z',
        errors: [],
        id: 'fb4d83a5-ebf3-497c-b7a4-14aa152da470',
        product_version: version,
        status: 'enabled',
        updated_at: '2022-03-25T10:56:27.268Z',
        ...config
      }
    }).as('getProductVersionApplicationRegistration')
})

Cypress.Commands.add('mockGrantedScopes', (versionId, applicationId, scopes = []) => {
  return cy.intercept(
    'GET',
    `**/api/v2/applications/${applicationId}/product-versions/${versionId}/granted-scopes`, {
      body: {
        scopes,
        meta: {
          page: {
            number: 1,
            size: 10,
            total: 0
          }
        }
      }
    }).as('getGrantedScopes')
})

Cypress.Commands.add('mockProductVersionAvailableRegistrations', (productId, versionId, apps) => {
  const availableRegistrations = apps.map((app) => {
    return {
      created_at: app.created_at,
      updated_at: app.updated_at,
      name: app.name,
      id: app.id,
      registration_id: null,
      registration_status: null
    }
  })

  const response = {
    data: availableRegistrations,
    meta: {
      page: {
        number: 1,
        size: 15,
        total: availableRegistrations.length
      }
    }
  }

  return cy.intercept(
    'GET',
    `**/api/v2/products/${productId}/versions/${versionId}/applications**`, {
      body: response
    }).as('getProductVersionAvailableRegistrations')
})

Cypress.Commands.add('mockProductsCatalog', (count = 1, overrides = [], pageNum = 1, pageSize = 12) => {
  const products = generateProducts(count, overrides)
  const response: SearchResults = {
    data: products,
    meta: {
      page: {
        number: pageNum,
        size: pageSize,
        total: products.length
      }
    }
  }

  cy.intercept('GET', '**/api/v2/search/product-catalog**', {
    statusCode: 200,
    body: response,
    delay: 0
  }).as('productSearch')
})

Cypress.Commands.add('mockGetProductDocumentBySlug', (productId, slug, options = {}) => {
  const docId = crypto.randomUUID()
  const revId = crypto.randomUUID()
  const time = new Date().toISOString()

  const resp = {
    document: {
      id: docId,
      activeRevisionId: revId,
      createdAt: time,
      modifiedAt: time,
      portalId: '08a7c50e-c9cb-4ab6-a683-16406a30cf91',
      slug: slug,
      status: 'published',
      ...options.document || {}
    },
    revision: {
      content: document,
      createdAt: time,
      documentId: docId,
      meta: {},
      revisionId: revId,
      title: 'Document title mock',
      ...options.revision || {}
    }
  }

  return cy.intercept(
    'GET',
    `**/api/v2/products/${productId}/documents/${slug}`,
    resp
  ).as('productDocument')
})

Cypress.Commands.add('mockGetProductDocuments', (productId) => {
  const docId = crypto.randomUUID()

  const resp: ListDocumentsTree = {
    data: generateDocuments(docId),
    meta: {
      page: {
        number: 1,
        size: 10,
        total: 1
      }
    }
  }

  return cy.intercept(
    'GET',
    `**/api/v2/products/${productId}/documents`,
    resp
  ).as('productDocuments')
})

Cypress.Commands.add('mockGetProductDocumentTree', (productId) => {
  return cy.intercept(
    'GET',
    `**/api/v2/products/${productId}/document_tree`,
    {
      statusCode: 304,
      body: {}
    }
  ).as('ProductDocumentTree')
})

Cypress.Commands.add('mockProductVersion', (productId = '*', versionId = '*', version = versions[0]) => {
  const versionResponse: ProductVersion = {
    ...version
  }

  cy.intercept('get', `**/api/v2/products/${productId}/versions/${versionId}`, {
    statusCode: 200,
    delay: 100,
    body: versionResponse
  }).as('productVersion')
})

Cypress.Commands.add('mockProductVersionSpec', (productId = '*', versionId = '*', content = JSON.stringify(petstoreJson30)) => {
  const specResponse: ProductVersionSpecDocument = {
    api_type: 'openapi',
    content
  }

  cy.intercept('get', `**/api/v2/products/${productId}/versions/${versionId}/spec`, {
    body: specResponse
  }).as('spec')
})

Cypress.Commands.add('mockProductOperations', (productId = '*', versionId = '*', operations = petstoreOperationsV2.operations as ProductVersionSpecOperationsOperationsInner[]) => {
  const operationsResponse: ProductVersionSpecOperations = {
    api_type: 'openapi',
    operations
  }

  cy.intercept('get', `**/api/v2/products/${productId}/versions/${versionId}/spec/operations`, {
    body: operationsResponse
  }).as('operations')
})

/**
 * Pass in the names and target values of Launch Darkly feature flags
 * @param {Array<FeatureFlag>} flags array of LD feature flags
 * @returns {Cypress.Chainable<null>} interceptor for chaining
 */
Cypress.Commands.add('mockLaunchDarklyFlags', (flags) => {
  return cy.intercept(
    'GET',
    'https://app.launchdarkly.com/sdk/evalx/**',
    (req) => {
      req.continue((res) => {
        for (const flag of flags) {
          res.body[flag.name].value = flag.value
        }
      })
    }
  ).as('mockLaunchDarklyFlags')
})
