import { product, productVersion } from '../fixtures/consts'
import childrenApiDocumentationJSON from '../fixtures/dochub_mocks/childrenApiDocumentation.json'
import documentTreeJSON from '../fixtures/dochub_mocks/documentTree.json'

describe('Api Documentation Page', () => {
  beforeEach(() => {
    product.document_count = 1
    cy.mockPrivatePortal()
    cy.mockProduct(product.id, product)
    cy.mockGetProductDocumentBySlug(product.id, 'bar')
    cy.mockGetProductDocuments(product.id)
    cy.mockProductOperations()
    cy.mockStylesheetFont()
  })

  const PARENT_DOCUMENT_URL = `/docs/${product.id}/${documentTreeJSON[0].slug}`
  const CHILD_DOCUMENT_URL = `${PARENT_DOCUMENT_URL}/${documentTreeJSON[0].children[0].slug}`

  it('displays empty state when no products', () => {
    product.document_count = 0
    cy.mockProduct(product.id, product)
    cy.mockProductDocumentTree(product.id, { body: [] })
    cy.visit(`/docs/${product.id}`)

    cy.get('[data-testid="documentation-empty-state"]').should('be.visible')
    cy.get('[data-testid="portal-document-viewer"]').should('not.exist')
  })

  it('displays proper error message when 400', () => {
    cy.intercept(
      'GET',
      `**/api/v2/products/${product.id}/documents/foo`,
      {
        statusCode: 400,
        body: {}
      }
    ).as('fetchProductDocument')

    cy.visit(`/docs/${product.id}/foo`)

    cy.wait('@fetchProductDocument')

    cy.get('[data-testid="api-documentation-page"]').should('be.visible')
    cy.get('[data-testid="error-wrapper"]').should('be.visible')
  })

  it('redirect when 404', () => {
    cy.intercept(
      'GET',
      `**/api/v2/products/${product.id}/documents/foo`,
      {
        statusCode: 404,
        body: {}
      }
    ).as('fetchProductDocument')

    cy.visit(`/docs/${product.id}/foo`)

    cy.wait('@fetchProductDocument')

    cy.location('pathname').should('equal', '/404')
  })

  it('shows correct document tree in left sidebar of the catalog page for each product', () => {
    cy.mockProductDocument()
    cy.mockProductVersionSpec()
    cy.mockProductDocumentTree()

    cy.visit(`/spec/${product.id}/${productVersion.id}`)
    cy.wait('@getMockProductDocumentTree')

    // verify if the parent document link is shown
    cy.get('a.title').contains('a', 'This is the parent document')
      .should('have.attr', 'href', PARENT_DOCUMENT_URL)
    cy.contains('This is the child document').should('not.be.visible')

    cy.get('.expand-button').click('topRight')

    // verify if the child document link is shown
    cy.get('a.title').contains('a', 'This is the child document')
      .should('have.attr', 'href', CHILD_DOCUMENT_URL)
    cy.contains('This is the child document').should('be.visible')
  })

  it('navigates to the correct API documentation page from Spec view using sidebar', () => {
    cy.mockProductVersionSpec()
    cy.mockProductDocumentTree()
    cy.mockProductApiDocument()

    cy.visit(`/spec/${product.id}/${productVersion.id}`)
    cy.wait('@getMockProductDocumentTree')

    cy.get('a.title').contains('a', 'This is the parent document').click()
    cy.wait('@getMockProductApiDocument')

    cy.url().should('include', PARENT_DOCUMENT_URL)
    cy.get('.k-breadcrumb-text').last().should('include.text', 'Documentation')
    cy.get('[data-testid="api-documentation-page"]').within(() => {
      cy.get('header h1').should('include.text', 'This is the parent document')
    })
  })

  it('shows correct document content', () => {
    cy.mockProductApiDocument()

    cy.visit(PARENT_DOCUMENT_URL)

    // verify the content on main page
    cy.get('[data-testid="api-documentation-page"]').children('div').within(() => {
      cy.get('h1').should('include.text', 'This is the parent document')
      cy.get('p').first().should('include.text', 'Paragraphs are separated by a blank line.')
      cy.get('p').last().should('include.text', 'Line one')
      cy.get('h2').should('include.text', 'An h2 header')
      cy.get('h3').should('include.text', 'An h3 header')
      cy.get('li').last().should('include.text', 'Dump everything in the pot')
    })

    // verify the content in right-hand sidebar
    cy.get('[data-testid="api-documentation-page"]').children('aside').within(() => {
      cy.get('p').should('include.text', 'On this page')
      cy.get('li a').contains('An h1 header')
        .should('have.attr', 'href', '#doc-heading-an-h1-header')
      cy.get('li a').contains('An h2 header')
        .should('have.attr', 'href', '#doc-heading-an-h2-header')
      cy.get('li a').contains('An h3 header')
        .should('have.attr', 'href', '#doc-heading-an-h3-header')
    })
  })

  it('scrolls to the correct heading when a link is clicked in sidebar', () => {
    cy.mockProductDocumentTree()
    // mock parent
    cy.mockProductApiDocument(product.id, {
      body: documentTreeJSON[0]
    })
    // mock child
    cy.mockProductApiDocument(product.id, {
      body: childrenApiDocumentationJSON
    })

    cy.visit(CHILD_DOCUMENT_URL)

    // heading at the top of the page
    cy.get('h1[id="doc-heading-child-document"]').should('be.visible')
    // heading at the bottom of the page
    cy.get('h3[id="doc-heading-an-h3-header"]').should('not.be.visible')

    // get the sidebar
    cy.get('[data-testid="api-documentation-page"]').children('aside').within(() => {
      // click on a link in sidebar
      cy.get('li a').contains('An h3 header').click().then(() => {
        cy.url().then((url) => {
          expect(url).to.contain('#doc-heading-an-h3-header')
          // scrolling is flaky in the cypress chrome browser. Hence we are getting the url after clicking the header link and reloading the page
          cy.visit(url)
        })
      })
    })
    cy.get('h3[id="doc-heading-an-h3-header"]').scrollIntoView().should('be.visible')
    cy.get('h1[id="doc-heading-child-document"]').should('not.be.visible')
  })
})
