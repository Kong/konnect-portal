import { THEMES, DEFAULT_FONTS } from '../fixtures/theme.constant'

// Commenting out as we're skipping these tests.
beforeEach(() => {
  cy.mockPublicPortal()
  cy.mockProductsCatalog()
})

describe('loads color theme variables', () => {
  beforeEach(() => {
    cy.mockStylesheetFont()
    cy.mockAppearance()
  })
  it('loads mint_rocket theme', () => {
    cy.mockStylesheetCss('mint_rocket')
    cy.visit('/')
    cy.get('#site-header')
    cy.log('themes', THEMES)
    Object.keys(THEMES.mint_rocket).forEach(sectionName => {
      const section = THEMES.mint_rocket[sectionName]

      Object.keys(section).forEach(colorName => {
        const varName = `${sectionName}-${colorName}`
        const value = section[colorName].value

        cy.window().then(window => {
          return expect(window.getComputedStyle(window.document.documentElement).getPropertyValue(`--${varName}`)).to.contain(value, `--${varName} should be ${value}`)
        })
      })
    })
  })

  it('loads dark theme', () => {
    cy.mockStylesheetCss('dark_mode')
    cy.visit('/')
    cy.get('#site-header')
    cy.log('themes', THEMES)
    Object.keys(THEMES.dark_mode).forEach(sectionName => {
      const section = THEMES.dark_mode[sectionName]

      Object.keys(section).forEach(colorName => {
        const varName = `${sectionName}-${colorName}`
        const value = section[colorName].value

        cy.window().then(window => {
          return expect(window.getComputedStyle(window.document.documentElement).getPropertyValue(`--${varName}`)).to.contain(value)
        })
      })
    })
  })
})

describe('fonts', () => {
  it('loads default fonts', () => {
    cy.mockStylesheetFont()
    cy.mockStylesheetCss()
    cy.mockAppearance()
    cy.visit('/')
    cy.get('#site-header')
    cy.get('body').should('have.css', 'font').should('contain', DEFAULT_FONTS.base)
  })

  it('loads custom fonts', () => {
    cy.mockAppearance()
    cy.mockStylesheetCss('mint_rocket', { base: 'Lobster', headings: 'Lato', code: 'Roboto Mono' })
    cy.mockStylesheetFont({ base: 'Lobster', headings: 'Lato', code: 'Roboto Mono' })
    cy.visit('/')
    cy.wait('@mockStylesheetFont')
    cy.get('#site-header')
    cy.get('body').should('have.css', 'font').should('contain', 'Lobster')
  })
})

describe('custom Catalog', () => {
  beforeEach(() => {
    cy.mockStylesheetFont()
    cy.mockStylesheetCss()
  })
  it('loads default values', () => {
    cy.mockPublicPortal()
    cy.mockAppearance()
    cy.visit('/')
    cy.get('#site-header')
    cy.get('.products-welcome').should('contain', 'Welcome to our API Portal!')
    cy.get('.products-title').should('contain', 'Start building and innovating with our APIs')
    cy.get('.products-top-section').should('have.css', 'background-image').and('not.match', /catalog_cover/)
  })
  it('loads custom values', () => {
    cy.readFile('cypress/e2e/fixtures/images/kong-logo.png', 'base64').then(b => {
      cy.mockAppearance({
        variables: {
          catalog: {
            cover: b,
            primary_header: {
              text: "where you goin' with that gun in your hand?"
            },
            welcome_message: {
              text: 'Hey Joe'
            }
          }
        }
      })
      cy.visit('/')
      cy.wait('@getAppearance')
      cy.get('#site-header')
      cy.get('.products-welcome').should('contain', 'Hey Joe')
      cy.get('.products-title').should('contain', "where you goin' with that gun in your hand?")
      cy.get('.products-top-section').should('have.css', 'background-image').and('match', /catalog-cover/)
    })
  })
})
