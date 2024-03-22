import { I18nType } from './i18n-type'
import { translationNeeded } from '@/locales/index'
import { en } from '@/locales/en'

export const ca_ES: I18nType = {
  login: {
    unauthenticated: "El compte no s'ha pogut autenticar.Si creieu que esteu rebent aquest missatge per error, poseu- vos en contacte amb l'administrador.",
    successText: "S'ha confirmat el vostre correu electrònic.S'està esperant l'aprovació del compte.",
    successButton: "D'acord",
    missingCredentials: "Introduïu les vostres credencials d'inici de sessió",
    missingAccount: 'No teniu un compte?',
    signUp: 'Registrar-se'
  },
  forgotPassword: {
    successText: 'Comproveu el vostre correu electrònic per obtenir un enllaç per restablir la contrasenya. Si no apareix en uns minuts, comproveu la carpeta de correu brossa (spam).',
    successButton: 'Tornar a la pàgina principal',
    heading: 'Recuperar contrasenya',
    subHeading: "Introduïu l'adreça de correu electrònic verificada del vostre compte d'usuari i us enviarem un enllaç per restablir la contrasenya.",
    placeholderEmail: 'Correu electrònic',
    buttonIdle: 'Enviar correu electrònic de restabliment de contrasenya',
    buttonSubmitting: 'Enviant',
    missingEmail: 'Introduïu la vostra adreça de correu electrònic'
  },
  resetPassword: {
    successText: 'Restabliment de contrasenya amb èxit.',
    successButton: "Tornar a l'inici de sessió",
    heading: 'Canviar contrasenya',
    placeholderPassword: 'Contrasenya',
    placeholderConfirmPassword: 'Confirmar contrasenya',
    buttonIdle: 'Canviar contrasenya',
    buttonSubmitting: 'Enviant',
    confirmPasswordFail: 'Les contrasenyes han de coincidir',
    missingPassword: 'Cal introduir les contrasenyes'
  },
  registration: {
    successText: 'Comproveu el vostre correu electrònic per confirmar la vostra adreça.',
    alreadyCreated: 'Ja teniu un compte?',
    login: 'Inicieu sessió aquí'
  },
  productVersion: {
    deprecatedWarningProduct: "Aquesta versió del producte ja no està vigent. Els punts d'interacció seguiran sent totalment funcionals fins que aquesta versió sigui retirada.",
    unableToRetrieveDoc: 'No es pot recuperar la documentació',
    noProductVersionsDetail: translationNeeded(en.productVersion.noProductVersionsDetail),
    noProductVersionsTitle: translationNeeded(en.productVersion.noProductVersionsTitle),
    registerProductVersion: translationNeeded(en.productVersion.registerProductVersion)
  },
  authStrategyInfo: {
    titleLabel: translationNeeded(en.authStrategyInfo.titleLabel),
    credentialTypeLabel: translationNeeded(en.authStrategyInfo.credentialTypeLabel),
    registerBtnText: (productVersionName: string) => translationNeeded(en.authStrategyInfo.registerBtnText(productVersionName)),
    authMethods: translationNeeded(en.authStrategyInfo.authMethods),
    keyNames: translationNeeded(en.authStrategyInfo.keyNames),
    bearer: translationNeeded(en.authStrategyInfo.bearer),
    keyAuth: translationNeeded(en.authStrategyInfo.keyAuth),
    clientCredentials: translationNeeded(en.authStrategyInfo.clientCredentials),
    selfManagedClientCredentials: translationNeeded(en.authStrategyInfo.selfManagedClientCredentials),
    session: translationNeeded(en.authStrategyInfo.session)
  },
  userDropdown: {
    myApps: 'Les meves aplicacions',
    logout: 'Tancar sessió'
  },
  sectionOverview: {
    title: 'Visió general'
  },
  viewSpecModal: {
    viewSpec: 'Veure especificació',
    copy: 'Copiar',
    download: 'Descarregar',
    close: 'Tancar',
    copySuccess: "S'ha copiat al porta- retalls",
    copyError: "No s'ha pogut copiar l'identificador al porta-retalls"
  },
  credentials: {
    noCredentialsText: 'Sense credencials',
    title: 'Autenticació',
    newButtonText: 'Generar credencial',
    copySubheading: 'Credencial per a ',
    creationModal: {
      title: 'Nom de la credencial',
      continueButton: 'Generar',
      inputLabel: 'Nom',
      inputPlaceholder: 'Proporcioneu un nom per a aquesta credencial',
      cancelButton: 'Cancel·lar'
    },
    revokeModal: {
      title: 'Revocar la credencial',
      description: {
        start: 'La clau ',
        end: ' serà revocada, aquesta acció no es pot desfer.'
      },
      revokeButton: 'Revocar',
      cancelButton: 'Cancel·lar'
    },
    renameModal: {
      actionLabel: 'Editar',
      title: 'Editar el nom de la credencial',
      continueButton: 'Guardar',
      inputLabel: 'Nom',
      inputPlaceholder: 'Proporcioneu un nou nom per a aquesta credencial',
      cancelButton: 'Cancel·lar'
    },
    copyModal: {
      title: 'Copiar la credencial',
      continueButton: 'Confirmar i copiar',
      copyButtonLabel: 'Credencial: ',
      cancelButton: 'Cancel·lar',
      hiddenCredentialsText: 'Només podreu copiar aquesta credencial una vegada. Copieu-la i emmagatzemeu-la en algun lloc segur.'
    }
  },
  application: {
    breadcrumbMyApps: 'Les meves aplicacions',
    edit: 'Editar',
    cancel: 'Cancel·lar',
    delete: 'Eliminar',
    proceed: 'Continuar',
    applicationName: "Nom de l'aplicació ",
    authStrategy: translationNeeded(en.application.authStrategy),
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    grantedScopes: translationNeeded(en.application.grantedScopes),
    availableScopes: translationNeeded(en.application.availableScopes),
    filterScopesPlaceholder: translationNeeded(en.application.filterScopesPlaceholder),
    clientID: 'ID de client: ',
    clientSecret: 'Clau secreta de client: ',
    reqField: ' indica un camp obligatori',
    redirectUriLabel: 'URI de redirecció',
    applicationCredentials: "Credencials de l'aplicació",
    applicationSecret: "Calau secreta de l'aplicació",
    confirmDelete: (name: any) => `Segur que voleu eliminar ${name}? Aquesta acció no es pot desfer`,
    description: 'Descripció',
    redirectUri: (uri: string) => `URI de redirecció: ${uri}`,
    referenceId: (id: string) => `ID de referència: ${id}`,
    form: {
      referenceId: {
        label: 'ID de referència',
        help: "Ha de coincidir amb l'ID de client de l'entitat d'aplicació del vostre proveïdor d'identitat en cas d'ús de OpenID",
        placeholder: 'Introduïu o genereu un ID',
        generate: 'Generar'
      }
    },
    headerDescription1: 'Aquí teniu la informació de client de la vostra aplicació anomenada ',
    headerDescription2: '. La clau secreta de client només es mostrarà ',
    headerDescription3: 'una vegada.',
    headerDescription4: 'Copieu aquest valor i guardeu-lo per a les vostres referències.'
  },
  analytics: {
    filterLabelProductVersions: translationNeeded(en.analytics.filterLabelProductVersions),
    chartOverview: translationNeeded(en.analytics.chartOverview),
    chartTitleRequests: translationNeeded(en.analytics.chartTitleRequests),
    chartTitleLatency: translationNeeded(en.analytics.chartTitleLatency),
    chartTitle4xxProductVersion: translationNeeded(en.analytics.chartTitle4xxProductVersion),
    chartTitle5xxProductVersion: translationNeeded(en.analytics.chartTitle5xxProductVersion),
    chartTitle4xxStatusCode: translationNeeded(en.analytics.chartTitle4xxStatusCode),
    chartTitle5xxStatusCode: translationNeeded(en.analytics.chartTitle5xxStatusCode),
    dashboard: translationNeeded(en.analytics.dashboard),
    resultsLimited: translationNeeded(en.analytics.resultsLimited),
    notAvailable: translationNeeded(en.analytics.notAvailable),
    sectionCurrent: translationNeeded(en.analytics.sectionCurrent),
    sectionLast: translationNeeded(en.analytics.sectionLast),
    sectionPrevious: translationNeeded(en.analytics.sectionPrevious),
    selectDateRange: translationNeeded(en.analytics.selectDateRange),
    selectProductVersions: translationNeeded(en.analytics.selectProductVersions),
    summary: translationNeeded(en.analytics.summary),
    summary24Hours: translationNeeded(en.analytics.summary24Hours),
    summary30Days: translationNeeded(en.analytics.summary30Days),
    summaryTooltip: (timespan: string) => translationNeeded(en.analytics.summaryTooltip(timespan)),
    timeRange: translationNeeded(en.analytics.timeRange),
    totalRequests: translationNeeded(en.analytics.totalRequests),
    unableToFetch: (itemName: string) => translationNeeded(en.analytics.unableToFetch(itemName)),
    viewAnalytics: translationNeeded(en.analytics.viewAnalytics)
  },
  productList: {
    titleProducts: 'Productes',
    showMoreLabel: (items: string) => translationNeeded(en.productList.showMoreLabel(items)),
    actions: {
      unregister: 'Anul·lar el registre'
    },
    emptyState: {
      titleProducts: 'Sense productes',
      viewCatalog1: 'Vegeu el catàleg',
      viewCatalog2Product: 'per registrar-vos en un producte.'
    },
    labels: {
      nameProduct: 'Producte',
      version: 'Versió',
      status: 'Estat',
      actions: 'Accions'
    }
  },
  dcrAuthentication: {
    authentication: 'Autenticació',
    refreshToken: 'Actualitzar token'
  },
  refreshTokenModal: {
    title: "Clau secreta de l'aplicació",
    proceed: 'Continuar',
    description1: 'Aquí teniu una nova clau secreta per a la vostra aplicació. La clau secreta de client només es mostrarà ',
    description2: 'una vegada. ',
    description3: 'Copieu aquest valor i guardeu-lo per a les vostres referències.',
    secret: 'Clau secreta: '
  },
  applicationRegistration: {
    noAvailableApplications: 'Actualment no teniu cap aplicació per registrar.',
    noFoundApplications: translationNeeded(en.applicationRegistration.noFoundApplications),
    searchPlaceholder: translationNeeded(en.applicationRegistration.searchPlaceholder),
    filterScopes: translationNeeded(en.applicationRegistration.filterScopes),
    availableScopesLabel: translationNeeded(en.applicationRegistration.availableScopesLabel),
    fetchingScopesLabel: translationNeeded(en.applicationRegistration.fetchingScopesLabel),
    updateScopesWarning: translationNeeded(en.applicationRegistration.updateScopesWarning),
    noApplications: 'Sense aplicacions',
    selectApplication: 'Seleccionar aplicació',
    createNewApplication: 'Crear nova aplicació +',
    createApplication: 'Crear una aplicació',
    cancelButton: 'Cancel·lar',
    registeredApplicationsProduct: 'Les següents aplicacions ja estan registrades en aquest producte:',
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => `Registrar - se per a ${serviceName} - ${productVersion}`,
      buttonText: 'Sol·licitar accés'
    },
    modalApplicationRegistrationStatusIsPending: {
      title: 'Registre en procés de revisió',
      body: "Rebreu una notificació un cop s'aprovi.",
      buttonText: 'Tancar'
    }
  },
  defaultForm: {
    missingFields: 'Si us plau, ompliu tots els camps obligatoris'
  },
  validationErrors: {
    isEmail: "L'adreça de correu electrònic ha de ser una adreça vàlida"
  },
  apiDocumentation: {
    emptyTitle: translationNeeded(en.apiDocumentation.emptyTitle),
    emptyMessage: translationNeeded(en.apiDocumentation.emptyMessage),
    error: {
      description: "S'ha produït un error inesperat en carregar el document sol·licitat.Si us plau, torneu- ho a provar més tard",
      linkText: 'Tornar a la pàgina inicial →'
    },
    sections: {
      onThisPage: 'En aquesta pàgina'
    }
  },
  errorWrapper: {
    linkText: 'Tornar a la pàgina inicial →'
  },
  sidebar: {
    noVersions: translationNeeded(en.sidebar.noVersions),
    deprecated: ' (Desactivat)',
    noResultsProduct: 'Sense versions de producte'
  },
  catalog: {
    entityTypeProduct: 'Producte',
    noResultsProduct: 'No hi ha productes disponibles'
  },
  catalogItem: {
    latestVersion: 'Última versió:',
    specificationLink: 'Especificació',
    documentationLink: 'Documentació'
  },
  catalogTable: {
    specificationLink: 'Especificació',
    documentationLink: 'Documentació'
  },
  products: {
    search: 'Cerca',
    searching: 'Cercant...'
  },
  copyButton: {
    clickToCopy: 'Feu clic per copiar',
    copyToClipboard: 'Copiar al porta-retalls',
    ariaLabel: 'Contingut del botó de còpia al porta-retalls',
    copyFailed: {
      start: "No s'ha pogut copiar",
      end: 'al porta-retalls'
    },
    copySucceeded: {
      start: 'S\'ha copiat "',
      end: '" al porta-retalls'
    }
  },
  nav: {
    catalog: 'Catàleg',
    breadcrumbProduct: 'Producte',
    breadcrumbDocumentation: 'Documentació',
    logoAlt: 'logotip'
  },
  authCard: {
    logoAlt: 'logotip'
  },
  forbidden: {
    logoAlt: 'logotip',
    http403: '403',
    goBack: 'Tornar',
    sorryMessage: 'Ho sentim. No teniu autorització per veure aquesta pàgina.',
    home: 'inici'
  },
  notFound: {
    http404: '404',
    goBack: 'Tornar',
    sorryMessage: 'Ho sentim. No podem trobar la pàgina que busqueu.',
    home: 'inici',
    logoAlt: 'logotip'
  },
  myApp: {
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    authStrategyFetchError: (errString: string) => translationNeeded(en.myApp.authStrategyFetchError(errString)),
    newApp: 'Nova aplicació',
    plus: 'Més',
    myApps: 'Les meves aplicacions',
    refreshSecret: 'Actualitzar secret',
    refreshSecretSuccess: translationNeeded(en.myApp.refreshSecretSuccess),
    refreshSecretFailure: (error: string) => translationNeeded(en.myApp.refreshSecretFailure(error)),
    noSearchResults: translationNeeded(en.myApp.noSearchResults),
    searchPlaceholder: translationNeeded(en.myApp.searchPlaceholder),
    delete: 'Eliminar',
    cancel: 'Cancel·lar',
    noApp: 'Sense aplicacions',
    create: 'Crear una nova aplicació',
    getStarted: ' per començar',
    deleteDialog: (name: string) => `Segur que voleu eliminar ${name}?Aquesta acció no es pot desfer.`,
    deleteSuccess: translationNeeded(en.myApp.deleteSuccess),
    deleteFailure: (str: string) => translationNeeded(en.myApp.deleteFailure(str))
  },
  router: {
    portalTitle: 'Portal del desenvolupador',
    loginTitle: 'Iniciar sessió',
    registrationTitle: 'Registre',
    forgotPasswordTitle: 'Heu oblidat la contrasenya',
    resetPasswordTitle: 'Restablir la contrasenya',
    catalogTitleProduct: 'Catàleg de productes',
    specTitle: "Especificació de l'API",
    oauth2RedirectTitle: translationNeeded(en.router.oauth2RedirectTitle),
    docsTitle: "Documentació de l'API",
    appsTitle: 'Les meves aplicacions',
    createAppTitle: 'Crear nova aplicació',
    createAppTitle2: 'Crear aplicació',
    viewAppTitle: 'Aplicació',
    updateAppTitle: 'Actualitzar aplicació',
    notFoundTitle: 'No trobat',
    forbiddenTitle: 'Prohibit',
    errorTitle: 'Error'
  },
  oauth2: {
    dataNotFound: translationNeeded(en.oauth2.authMaybeUnsafe),
    noDescription: translationNeeded(en.oauth2.noDescription),
    moreInfo: translationNeeded(en.oauth2.moreInfo),
    authMaybeUnsafe: translationNeeded(en.oauth2.authMaybeUnsafe),
    defaultError: translationNeeded(en.oauth2.defaultError)
  }
}
