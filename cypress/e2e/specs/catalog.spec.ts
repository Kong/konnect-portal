import { ProductCatalogIndexSourceLatestVersion, SearchResults, SearchResultsDataInner } from '@kong/sdk-portal-js'
import { generateProducts } from '../support/utils/generateProducts'

const mockProductSearchQuery = (searchQuery: string) => {
  const searchResults: SearchResultsDataInner[] = ([
    ['barAPI', ['v1-beta']],
    ['fooApi', ['v1']],
    ['sampleapi', ['v1']],
    ['testapi', ['v1']],
    ['xapi', ['v1']]
  ] as [string, string[]][])
    .filter((data) =>
      searchQuery !== '' ? JSON.stringify(data).includes(searchQuery) : true
    )
    .map(([name, versions]) => ({
      index: 'product-catalog',
      source: {
        id: crypto.randomUUID(),
        description: '',
        document_count: 0,
        created_at: '',
        updated_at: '',
        name,
        version_count: versions.length,
        latest_version: {
          name: versions[0],
          id: crypto.randomUUID()
        }
      }
    }))

  const responseBody: SearchResults = {
    data: searchResults,
    meta: {
      page: {
        number: 1,
        size: searchResults.length,
        total: searchResults.length
      }
    }
  }

  cy.intercept('GET', '**/api/v2/search/product-catalog**', {
    times: 1,
    statusCode: 200,
    body: responseBody,
    delay: 0
  }).as('productSearch')
}

const mockProductSearchResults = (searchResults:SearchResultsDataInner[], pageNumber: number, totalCount:number) => {
  const responseBody: SearchResults = {
    data: searchResults,
    meta: {
      page: {
        number: pageNumber,
        size: searchResults.length,
        total: totalCount
      }
    }
  }

  cy.intercept('GET', '**/api/v2/search/product-catalog**', {
    delay: 0,
    statusCode: 200,
    body: responseBody
  }).as('productSearch')
}

describe('Catalog', () => {
  beforeEach(() => {
    cy.mockStylesheetFont()
    cy.mockAppearance()
    cy.mockStylesheetCss()
    cy.mockProductVersionSpec()
  })

  describe('Catalog card view', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(1, [{ description: 'great description' }])

      cy.visit('/')
    })

    it('loads one product with details', () => {
      cy.get('.catalog-item').should('have.length', 1)
      cy.get('.catalog-item').should('contain', 'barAPI0')
      cy.get('.catalog-item').should('contain', 'v0')
      cy.get('.catalog-item').should('contain', 'great description')
    })

    it('sets the catalog title', () => {
      cy.get('.products-label').should('contain', 'Product')
      cy.title().should('eq', 'Product Catalog | Developer Portal')
    })

    it('goes to details view on header click', () => {
      cy.mockPublicPortal()
      cy.mockProduct()

      cy.get('.catalog-item .products-card-title').first().click()
      cy.url().should('include', '/spec')
    })

    it('goes to details view on specification link click', () => {
      cy.mockPublicPortal()
      cy.mockProduct()
      cy.mockProductsCatalog(1, [{ description: 'great description' }])

      cy.visit('/')

      cy.get('.catalog-item .link').contains('Specification').click()
      cy.url().should('include', '/spec')
    })

    it('does not render specification link if no latest version', () => {
      cy.mockPublicPortal()
      cy.mockProduct()
      cy.mockProductsCatalog(1, [{ description: 'great description', latest_version: null as ProductCatalogIndexSourceLatestVersion }])

      cy.visit('/')

      cy.get('.catalog-item .link').should('not.exist')
    })

    it('displays an empty state with no products', () => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(0)

      cy.visit('/')

      cy.get('.product-catalog-no-products').should('have.length', 1)
    })

    it('disables view switcher with no products', () => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(0)

      cy.visit('/')

      cy.get('.product-catalog-no-products').should('have.length', 1)
      cy.get('[data-testid="view-switcher"]').should('be.disabled')
    })

    it('renders the documentation link for catalog item', () => {
      cy.mockPrivatePortal()
      cy.mockProductsCatalog(1, [{ description: 'great description', document_count: 2 }])
      cy.visit('/')
      cy.get('.catalog-item .link').contains('Documentation').should('exist')
    })

    it('does not render the documentation link for catalog item if no documents', () => {
      cy.mockPrivatePortal()
      cy.mockProductsCatalog(1, [{ description: 'great description' }])
      cy.visit('/')
      cy.get('.catalog-item .link').contains('Documentation').should('not.exist')
    })
  })

  describe('Catalog table view', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(13)
      cy.visit('/')
      cy.wait('@productSearch').then(() => {
        cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
      })
    })

    it('displays the table view', () => {
      cy.get('.k-table').should('have.length', 1)
      cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 13)
      cy.get('.card-pagination-bar')
        .should('have.length', 1)
        .get('.card-pagination-bar')
        .contains('1 - 12 of 13')
    })

    it('goes to details view on click', () => {
      cy.get('.k-table tbody td:nth-of-type(1)').first().click()

      cy.mockProduct()

      cy.url().should('include', '/spec')
    })
    it('renders the documentation link for catalog item ', () => {
      cy.mockPrivatePortal()
      cy.mockProductsCatalog(1, [{ description: 'great description', document_count: 1 }])
      cy.mockProduct()
      cy.visit('/')

      cy.wait('@productSearch').then(() => {
        cy.get('.k-table').should('have.length', 1)
        cy.get('.k-table thead th').should('contain', 'Details').should('exist')
        cy.get('.k-table tbody td:nth-of-type(4) a').should('exist').should('contain', 'Specification')
        cy.get('.k-table tbody td:nth-of-type(4) a').should('exist').should('contain', 'Documentation')
      })
    })
  })

  describe('Catalog versions', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
    })

    it('displays most recent created_at version', () => {
      cy.mockProductsCatalog(1, [{
        version_count: 2,
        latest_version: {
          id: '6159b9be-bfbc-4f30-bd22-df720f6dcf90',
          name: 'v4'
        }
      }])

      cy.visit('/')
      cy.get('.product-version').should('have.length', 1).contains('v4')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody tr:first-child td:nth-child(3)')
        .should('have.length', 1)
        .contains('v4')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
    })

    it('displays most recent created_at regardless of version name', () => {
      cy.mockProductsCatalog(1, [{
        version_count: 2,
        latest_version: {
          id: '6159b9be-bfbc-4f30-bd22-df720f6dcf90',
          name: 'v4'
        }
      }])
      cy.visit('/')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody tr:first-child td:nth-child(3)')
        .should('have.length', 1)
        .contains('v4')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
    })
  })

  describe('Catalog search', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      mockProductSearchQuery('')
      cy.visit('/')
    })

    it('loads all product packages', () => {
      cy.get('.catalog-item').should('have.length', 5)
    })

    it('searches when search button clicked', () => {
      const searchQuery = 'x'

      mockProductSearchQuery(searchQuery)

      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search-button]').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 1)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('searches when {enter} is typed', () => {
      const searchQuery = 'x'

      mockProductSearchQuery(searchQuery)

      cy.get('[data-testid=catalog-search]').type(searchQuery + '{enter}')
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 1)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('shows multiple results when searching', () => {
      const searchQuery = 's'

      mockProductSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search-button]').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 2)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('updates table entries when searching', () => {
      const searchQuery = 's'

      mockProductSearchQuery('')
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody td:nth-of-type(1)')
        .should('have.length', 5)

      mockProductSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 2)
      })
    })
    it('updates the table entries when clearing the field', () => {
      const searchQuery = 's'

      mockProductSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 2)
      })
      mockProductSearchQuery('')
      cy.get('[data-testid=catalog-search]').trigger('search')
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 5)
      })
    })
  })

  describe('Create a lot of products', () => {
    const totalProductCount = 37
    const productsData = generateProducts(37)

    describe('Catalog search', () => {
      beforeEach(() => {
        cy.mockPublicPortal()
        cy.mockAppearance()
      })

      it('shows 12 products', () => {
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.visit('/')
        cy.get('.catalog-item').should('have.length', 12)
      })

      it('does not display pagination bar if few enough results', () => {
        cy.visit('/')
        mockProductSearchResults(productsData.slice(12, 24), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
        cy.get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        const searchQuery = 'barAPI22'

        mockProductSearchResults(
          productsData.filter((s) => s.source.name === searchQuery),
          1,
          1
        )
        cy.get('[data-testid=catalog-search]').type(searchQuery + '{enter}')

        cy.wait('@productSearch').then(() => {
          cy.get('.catalog-item').should('have.length', 1)
          cy.get('.card-pagination-bar').should('not.exist')

          const searchInput = cy.get('[data-testid=catalog-search]')

          for (let i = 0; i < searchQuery.length; i++) {
            searchInput.type('{backspace}')
          }
        })
      })

      it('returns to first page on search', () => {
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.visit('/')
        cy.get('[data-testid=catalog-search]').type('{enter}')
        mockProductSearchResults(productsData.slice(12, 24), 2, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
        cy.get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        const searchQuery = 'API'

        mockProductSearchResults(productsData.slice(0, 12), 1, 13)
        cy.get('[data-testid=catalog-search]').type(searchQuery + '{enter}')
        cy.wait('@productSearch')
          .its('response.url')
          .should('contain', 'page%5Bnumber%5D=1')
          .then(() => {
            cy.get('.catalog-item').should('have.length', 12)
            cy.get('.card-pagination-bar')
              .should('have.length', 1)
              .get('.card-pagination-bar')
              .contains('1 - 12 of 13')
          })
      })

      it('sets offset back to 0 when switching to table view', () => {
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.visit('/')
        cy.get('[data-testid=catalog-search]').type('{enter}')
        mockProductSearchResults(productsData.slice(12, 24), 2, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
        cy.get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        cy.get('[data-testid="view-switcher"]:not(:disabled)').click()

        mockProductSearchResults(productsData.slice(0, 12), 2, totalProductCount)
        cy.wait('@productSearch')
          .its('response.url')
          .should('contain', 'page%5Bnumber%5D=1')
      })
    })

    describe('Catalog card list pagination', () => {
      beforeEach(() => {
        cy.mockPublicPortal()
        cy.mockProductsCatalog(totalProductCount)
      })

      it('shows 12 products', () => {
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.visit('/')
        cy.wait('@productSearch').then(() => {
          cy.get('.catalog-item').should('have.length', 12)
        })
        cy.get('.card-pagination-bar')
          .should('have.length', 1)
          .get('.card-pagination-bar')
          .contains('1 - 12 of 37')
      })

      it('allows next page and back', () => {
        // forwards
        mockProductSearchResults(productsData.slice(0, 12), 2, totalProductCount)
        cy.visit('/')
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        cy.get('.card-pagination-bar').contains('13 - 24 of 37')
        // backwards
        mockProductSearchResults(productsData.slice(0, 12), 12, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-backwards]').click()
        cy.get('.card-pagination-bar')
          .contains('1 - 12 of 37')
          .get('.catalog-item')
          .should('have.length', 12)
        // to last page
        mockProductSearchResults(productsData.slice(0, 1), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar')
          .contains('37 - 37 of 37')
          .get('.catalog-item')
          .should('have.length', 1)
      })

      it('allows go to first page and go to last page', () => {
        cy.visit('/')
        // forwards
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        // to first page
        mockProductSearchResults(productsData.slice(0, 12), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-first]')
          .click()
          .get('.card-pagination-bar')
          .contains('1 - 12 of 37')
          .get('.catalog-item')
          .should('have.length', 12)
        // to last page
        mockProductSearchResults(productsData.slice(0, 1), 1, totalProductCount)
        cy.get('.card-pagination-bar [data-testid=pagination-last]')
          .click()
          .get('.card-pagination-bar')
          .contains('37 - 37 of 37')
          .get('.catalog-item')
          .should('have.length', 1)
      })
    })
  })
})
