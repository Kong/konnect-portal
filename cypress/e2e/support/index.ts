/* eslint-disable no-console */
// Import commands.js using ES2015 syntax:
import { GetApplicationResponse, GetRegistrationResponse, PortalAuthStrategy, ListCredentialsResponseDataInner, PortalAppearance, PortalContext, Product, ProductCatalogIndexSource, ProductVersion, ProductVersionSpecOperationsOperationsInner } from '@kong/sdk-portal-js'
import './mock-commands'
import { SinonStub } from 'cypress/types/sinon'

// from https://docs.cypress.io/guides/tooling/typescript-support
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      visit(url:string, options?: Partial<TypeOptions> & {useOriginalFn: boolean}): Chainable<JQuery<HTMLElement>>
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      mockPrivatePortal(portalOptions?:Partial<PortalContext>): Chainable<null>
      mockPublicPortal(): Chainable<JQuery<HTMLElement>>
      mockSuccessfulDeveloperAuth(): Chainable<JQuery<HTMLElement>>
      mockSuccessfulPasswordReset(): Chainable<JQuery<HTMLElement>>
      mockGetUserInfo(): Chainable<JQuery<HTMLElement>>
      mockProductDocument(productId?:string, productVersionId?:string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProductDocumentTree(productId?: string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProductApiDocument(productId?: string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProduct(productId?: string, mockProduct?: Product, mockVersions?: ProductVersion[]): Chainable<JQuery<HTMLElement>>
      mockProductVersion(productId?: string, versionId?: string, mockVersion?: ProductVersion): Chainable<JQuery<HTMLElement>>
      mockApplications(searchResults?: Array<GetApplicationResponse>, totalCount?: number, pageSize?: number, pageNumber?: number): Chainable<JQuery<HTMLElement>>
      mockApplicationAuthStrategies(authStrategyItems?: Array<PortalAuthStrategy>, totalCount?: number, pageSize?: number, pageNumber?: number): Chainable<JQuery<HTMLElement>>
      mockApplicationWithCredAndReg(data: GetApplicationResponse, credentials?: ListCredentialsResponseDataInner[], registrations?: Array<GetRegistrationResponse>): Chainable<JQuery<HTMLElement>>,
      mockContextualAnalytics(): Chainable<JQuery<HTMLElement>>
      mockRegistrations(applicationId?: string, registrations?: Array<GetRegistrationResponse>, totalCount?: number): Chainable<JQuery<HTMLElement>>
      mockProductVersionApplicationRegistration(value:any): Chainable<JQuery<HTMLElement>>
      mockGrantedScopes(versionId: string, applicationId: string, scopesResponse?: string[]): Chainable<JQuery<HTMLElement>>
      mockProductVersionAvailableRegistrations(productId: string, versionId: string, apps: GetApplicationResponse[]): Chainable<JQuery<HTMLElement>>
      mockProductsCatalog(count?: number, overrides?: Partial<ProductCatalogIndexSource>[], pageNum?:number, pageSize?:number): Chainable<JQuery<HTMLElement>>
      mockGetProductDocumentBySlug(servicePckageId: string, slug:string, options?:Partial<TypeOptions> & {document?:any, revision?: any}): Chainable<JQuery<HTMLElement>>
      mockGetProductDocuments(productId:string): Chainable<JQuery<HTMLElement>>
      mockGetProductDocumentTree(productId?:string): Chainable<JQuery<HTMLElement>>
      createNewApplication(app: GetApplicationResponse, productId?: string, versions?: any[], options?: Partial<TypeOptions>): Chainable<string>
      mockProductOperations(productId?:string, versionId?:string, operations?: ProductVersionSpecOperationsOperationsInner[]): Chainable<JQuery<HTMLElement>>
      mockProductVersionSpec(productId?:string, versionId?:string, content?: string): Chainable<JQuery<HTMLElement>>
      mockStylesheetFont(fonts?: {[key:string]:string}): Chainable<JQuery<HTMLElement>>
      mockStylesheetCss(themeName?: string, fonts?: {[key:string]:string}): Chainable<JQuery<HTMLElement>>
      mockAppearance(appearance?: PortalAppearance): Chainable<JQuery<HTMLElement>>
      mockLogo(): Chainable<JQuery<HTMLElement>>
      mockCatalogCover(): Chainable<JQuery<HTMLElement>>
      mockLaunchDarklyFlags(flags: Array<{name:string, value:boolean}>): Chainable<JQuery<HTMLElement>>
      mockDeveloperRefresh(): Chainable<JQuery<HTMLElement>>
      mockDeveloperLogout(): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Import commands.js using ES2015 syntax:
require('cypress-terminal-report/src/installLogsCollector')()

beforeEach(() => {
  const API_URL = Cypress.env('VITE_PORTAL_API_URL')
  const notMockedAPIRequests = cy.stub().as('notMockedAPIRequests')
  const notMockedLDRequests = cy.stub().as('unmockedLaunchDarklyRequests')

  // mock all API requests
  cy.intercept(`**${API_URL}**`, notMockedAPIRequests)

  // mock all launchdarkly requests
  cy.intercept('https://*.launchdarkly.com/**', notMockedLDRequests)
})

afterEach(() => {
  cy.get<SinonStub>('@notMockedAPIRequests')
    .then(stub => cy.wrap(stub.getCalls().map(call => call.args[0].url).join(', ')))
    .then(urls => console.info({ message: 'Unmocked API requests', urls }))

  cy.get<SinonStub>('@unmockedLaunchDarklyRequests')
    .then(stub => cy.wrap(stub.getCalls().map(call => call.args[0].url).join(', ')))
    .then(urls => console.info({ message: 'Unmocked LD requests', urls }))
})
