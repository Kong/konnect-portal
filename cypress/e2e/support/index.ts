// Import commands.js using ES2015 syntax:
import { GetApplicationResponse, GetRegistrationResponse, PortalAppearance, PortalContext, Product, ProductCatalogIndexSource, ProductVersion, ProductVersionSpecOperationsOperationsInner } from '@kong/sdk-portal-js'
import './mock-commands'

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
      mockDcrPortal(): Chainable<JQuery<HTMLElement>>
      mockPublicPortal(): Chainable<JQuery<HTMLElement>>
      mockSuccessfulDeveloperAuth(): Chainable<JQuery<HTMLElement>>
      mockSuccessfulPasswordReset(): Chainable<JQuery<HTMLElement>>
      mockGetUserInfo(): Chainable<JQuery<HTMLElement>>
      mockProductDocument(productId?:string, productVersionId?:string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProductDocumentTree(productId?: string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProductApiDocument(productId?: string, options?: Partial<TypeOptions> & {body: any}): Chainable<JQuery<HTMLElement>>
      mockProduct(productId?: string, mockProduct?: Product, mockVersions?: ProductVersion[]): Chainable<JQuery<HTMLElement>>
      mockApplications(searchResults?: Array<GetApplicationResponse>, totalCount?: number, pageSize?: number, pageNumber?: number): Chainable<JQuery<HTMLElement>>
      mockRegistrations(applicationId?: string, registrations?: Array<GetRegistrationResponse>, totalCount?: number): Chainable<JQuery<HTMLElement>>
      mockProductVersionApplicationRegistration(value:any): Chainable<JQuery<HTMLElement>>
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
      mockLaunchDarklyFlags(flags: Array<{name:string, value:boolean}>): Chainable<JQuery<HTMLElement>>
      mockDeveloperRefresh(): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Import commands.js using ES2015 syntax:
require('cypress-terminal-report/src/installLogsCollector')()
