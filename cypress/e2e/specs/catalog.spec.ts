import { SearchResults, SearchResultsDataInner } from '@kong/sdk-portal-js'
import { v4 as uuidv4 } from 'uuid'
import { generateProducts } from '../support/utils/generateProducts'

const mockServiceSearchQuery = (searchQuery: string) => {
  const searchResults: SearchResultsDataInner[] = [
    ['barAPI', ['v1-beta'], uuidv4()],
    ['fooApi', ['v1'], uuidv4()],
    ['sampleapi', ['v1'], uuidv4()],
    ['testapi', ['v1'], uuidv4()],
    ['xapi', ['v1'], uuidv4()]
  ]
    .filter((data) =>
      searchQuery !== '' ? JSON.stringify(data).includes(searchQuery) : true
    )
    .map(([name, versions, id]) => ({ index: 'product-catalog', source: { description: '', has_documentation: false, created_at: '', updated_at: '', name, versions, id } }))
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
    statusCode: 200,
    body: responseBody,
    delay: 0
  }).as('productSearch')
}

const mockServiceSearchResults = (searchResults:SearchResultsDataInner[], pageNumber: number, totalCount:number) => {
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
  describe('Catalog card view', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(1, [{ description: 'great description' }])

      cy.visit('/')
    })

    it('loads one service package with details', () => {
      cy.get('.catalog-item').should('have.length', 1)
      cy.get('.catalog-item').should('contain', 'barAPI')
      cy.get('.catalog-item').should('contain', 'v2')
      cy.get('.catalog-item').should('contain', 'great description')
      cy.title().should('eq', 'Service Catalog | Developer Portal')
    })

    it('goes to details view on header click', () => {
      cy.mockPublicPortal()
      cy.mockServicePackage()

      cy.get('.catalog-item .services-card-title').first().click()
      cy.url().should('include', '/spec')
    })

    it('goes to details view on specification link click', () => {
      cy.mockPublicPortal()
      cy.mockServicePackage()
      cy.mockProductsCatalog(1, [{ description: 'great description' }])

      cy.visit('/')

      cy.get('.catalog-item .link').contains('Specification').click()
      cy.url().should('include', '/spec')
    })

    it('displays an empty state with no services', () => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(0)

      cy.visit('/')

      cy.get('.serv-catalog-no-services').should('have.length', 1)
    })

    it('disables view switcher with no services', () => {
      cy.mockPublicPortal()
      cy.mockProductsCatalog(0)

      cy.visit('/')

      cy.get('.serv-catalog-no-services').should('have.length', 1)
      cy.get('[data-testid="view-switcher"]').should('be.disabled')
    })

    it('renders the documentation link for catalog item', () => {
      cy.mockPrivatePortal()
      cy.mockProductsCatalog(1, [{ description: 'great description', has_documentation: true }])
      cy.visit('/')
      cy.get('.catalog-item .link').contains('Documentation').should('exist')
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
    })

    it('goes to details view on click', () => {
      cy.get('.k-table tbody td:nth-of-type(1)').first().click()

      cy.mockServicePackage()

      cy.url().should('include', '/spec')
    })
    it('renders the documentation link for catalog item ', () => {
      cy.mockPrivatePortal()
      cy.mockProductsCatalog(1, [{ description: 'great description', has_documentation: true }])

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
        versions: [
          {
            created_at: '2022-03-23T12:41:09.371Z',
            updated_at: '2022-03-23T12:41:09.371Z',
            id: '6159b9be-bfbc-4f30-bd22-df720f6dcf90',
            name: 'v4',
            deprecated: false
          },
          {
            created_at: '2022-03-23T11:46:35.613Z',
            updated_at: '2022-03-23T11:46:35.613Z',
            id: 'b820d3eb-5b70-47e5-8d97-9436a8021282',
            name: 'v1-beta',
            deprecated: false
          }
        ]
      }])

      cy.visit('/')
      cy.get('.service-version').should('have.length', 1).contains('v4')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody tr:first-child td:nth-child(3)')
        .should('have.length', 1)
        .contains('v4')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
    })

    it('displays most recent created_at regardless of version name', () => {
      cy.mockProductsCatalog(1, [{
        versions: [
          {
            created_at: '2022-03-23T12:41:09.371Z',
            updated_at: '2022-03-23T12:41:09.371Z',
            id: '6159b9be-bfbc-4f30-bd22-df720f6dcf90',
            name: 'v4',
            deprecated: false
          },
          {
            created_at: '2022-03-24T11:46:35.613Z',
            updated_at: '2022-03-24T11:46:35.613Z',
            id: 'b820d3eb-5b70-47e5-8d97-9436a8021282',
            name: 'v1-beta',
            deprecated: false
          }
        ]
      }])
      cy.visit('/')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody tr:first-child td:nth-child(3)')
        .should('have.length', 1)
        .contains('v1-beta')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
    })
  })

  describe('Catalog search', () => {
    beforeEach(() => {
      cy.mockPublicPortal()
      mockServiceSearchQuery('')
      cy.visit('/')
    })

    it('loads all service packages', () => {
      cy.get('.catalog-item').should('have.length', 5)
    })

    it('searches when search button clicked', () => {
      const searchQuery = 'x'

      mockServiceSearchQuery(searchQuery)

      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search-button]').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 1)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('searches when {enter} is typed', () => {
      const searchQuery = 'x'

      mockServiceSearchQuery(searchQuery)

      cy.get('[data-testid=catalog-search]').type(searchQuery + '{enter}')
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 1)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('shows multiple results when searching', () => {
      const searchQuery = 's'

      mockServiceSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search-button]').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.catalog-item').should('have.length', 2)
        cy.get('[data-testid=catalog-search]').type('{backspace}')
      })
    })

    it('updates table entries when searching', () => {
      const searchQuery = 's'

      mockServiceSearchQuery('')
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.get('[data-testid="view-switcher"]:not(:disabled)')
        .click()
        .get('.k-table tbody td:nth-of-type(1)')
        .should('have.length', 5)

      mockServiceSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 2)
      })
    })
    it('updates the table entries when clearing the field', () => {
      const searchQuery = 's'

      mockServiceSearchQuery(searchQuery)
      cy.get('[data-testid=catalog-search]').type(searchQuery)
      cy.get('[data-testid=catalog-search]').type('{enter}')
      cy.get('[data-testid="view-switcher"]:not(:disabled)').click()
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 2)
      })
      mockServiceSearchQuery('')
      cy.get('[data-testid=catalog-search]').trigger('search')
      cy.wait('@productSearch').then(() => {
        cy.get('.k-table tbody td:nth-of-type(1)').should('have.length', 5)
      })
    })
  })

  describe('Create a lot of services', () => {
    const totalServiceCount = 37
    const servicesData = generateProducts(37)

    describe('Catalog search', () => {
      beforeEach(() => {
        cy.mockPublicPortal()
        cy.mockAppearance()
      })

      it('shows 12 services', () => {
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
        cy.visit('/')
        cy.get('.catalog-item').should('have.length', 12)
      })

      it('does not display pagination bar if few enough results', () => {
        cy.visit('/')
        mockServiceSearchResults(servicesData.slice(12, 24), 1, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        const searchQuery = 'barAPI22'

        mockServiceSearchResults(
          servicesData.filter((s) => s.source.name === searchQuery),
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
        mockServiceSearchResults(servicesData, 1, totalServiceCount)
        cy.visit('/')
        cy.get('[data-testid=catalog-search]').type('{enter}')
        mockServiceSearchResults(servicesData.slice(12, 24), 2, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        const searchQuery = 'API'

        mockServiceSearchResults(servicesData.slice(0, 12), 1, 13)
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
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
        cy.visit('/')
        cy.get('[data-testid=catalog-search]').type('{enter}')
        mockServiceSearchResults(servicesData.slice(12, 24), 2, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]')
          .click()
          .get('.card-pagination-bar')
          .contains('13 - 24 of 37')

        cy.get('[data-testid="view-switcher"]:not(:disabled)').click()

        mockServiceSearchResults(servicesData.slice(0, 12), 2, totalServiceCount)
        cy.wait('@productSearch')
          .its('response.url')
          .should('contain', 'page%5Bnumber%5D=1')
      })
    })

    describe('Catalog card list pagination', () => {
      beforeEach(() => {
        cy.mockPublicPortal()
        cy.mockProductsCatalog(totalServiceCount)
      })

      it('shows 12 services', () => {
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
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
        mockServiceSearchResults(servicesData.slice(0, 12), 2, totalServiceCount)
        cy.visit('/')
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        cy.get('.card-pagination-bar').contains('13 - 24 of 37')
        // backwards
        mockServiceSearchResults(servicesData.slice(0, 12), 12, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-backwards]').click()
        cy.get('.card-pagination-bar')
          .contains('1 - 12 of 37')
          .get('.catalog-item')
          .should('have.length', 12)
        // to last page
        mockServiceSearchResults(servicesData.slice(0, 1), 1, totalServiceCount)
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
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-forwards]').click()
        // to first page
        mockServiceSearchResults(servicesData.slice(0, 12), 1, totalServiceCount)
        cy.get('.card-pagination-bar [data-testid=pagination-first]')
          .click()
          .get('.card-pagination-bar')
          .contains('1 - 12 of 37')
          .get('.catalog-item')
          .should('have.length', 12)
        // to last page
        mockServiceSearchResults(servicesData.slice(0, 1), 1, totalServiceCount)
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
