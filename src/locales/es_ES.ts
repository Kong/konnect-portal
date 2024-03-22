import { I18nType } from './i18n-type'
import { translationNeeded } from '@/locales/index'
import { en } from '@/locales/en'

export const es_ES: I18nType = {
  login: {
    unauthenticated: 'No se pudo autenticar la cuenta. Si crees que estás recibiendo este mensaje por error, ponte en contacto con tu administrador.',
    successText: 'Tu correo ha sido confirmado. En espera de aprobación de la cuenta.',
    successButton: 'OK',
    missingCredentials: 'Por favor, introduce tus credenciales de inicio de sesión',
    missingAccount: '¿No estás registrado?',
    signUp: 'Regístrate'
  },
  forgotPassword: {
    successText: 'Revisa tu correo electrónico para obtener un enlace que te permita restablecer tu contraseña. Si no aparece en unos minutos, revisa tu carpeta de correo no deseado.',
    successButton: 'Regresar a la página de inicio',
    heading: 'Recuperar contraseña',
    subHeading: 'Introduce la dirección de correo electrónico verificada de tu cuenta de usuario y te enviaremos un enlace para restablecer tu contraseña.',
    placeholderEmail: 'Email',
    buttonIdle: 'Enviar correo electrónico para restablecer la contraseña',
    buttonSubmitting: 'Enviando',
    missingEmail: 'Por favor, introduce tu dirección de correo electrónico'
  },
  resetPassword: {
    successText: 'Contraseña restablecida correctamente.',
    successButton: 'Regresar a la página de inicio de sesión',
    heading: 'Cambiar contraseña',
    placeholderPassword: 'Contraseña',
    placeholderConfirmPassword: 'Confirmar contraseña',
    buttonIdle: 'Cambiar contraseña',
    buttonSubmitting: 'Enviando',
    confirmPasswordFail: 'Las contraseñas deben coincidir',
    missingPassword: 'Las contraseñas son obligatorias'
  },
  registration: {
    successText: 'Por favor, revisa tu correo electrónico para confirmar tu dirección.',
    alreadyCreated: '¿Ya tienes una cuenta?',
    login: 'Inicia sesión aquí'
  },
  productVersion: {
    deprecatedWarningProduct: 'Esta versión del producto está obsoleta. La interfaz seguirá siendo totalmente utilizable hasta que esta versión se elimine.',
    unableToRetrieveDoc: 'No se puede recuperar la documentación',
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
    myApps: 'Mis aplicaciones',
    logout: 'Cerrar sesión'
  },
  sectionOverview: {
    title: 'Descripción general'
  },
  viewSpecModal: {
    viewSpec: 'Ver especificación',
    copy: 'Copiar',
    download: 'Descargar',
    close: 'Cerrar',
    copySuccess: 'Copiado al portapapeles',
    copyError: 'Error al copiar el ID al portapapeles'
  },
  credentials: {
    noCredentialsText: 'Sin credenciales',
    title: 'Autenticación',
    newButtonText: 'Crear credencial',
    copySubheading: 'Credencial para ',
    creationModal: {
      title: 'Nombre de la credencial',
      continueButton: 'Generar',
      inputLabel: 'Nombre',
      inputPlaceholder: 'Proporciona un nombre para esta credencial',
      cancelButton: 'Cancelar'
    },
    revokeModal: {
      title: 'Revocar la credencial',
      description: {
        start: 'Credencial ',
        end: ' será revocada. Esta acción no puede deshacerse.'
      },
      revokeButton: 'Revocar',
      cancelButton: 'Cancelar'
    },
    renameModal: {
      actionLabel: 'Editar',
      title: 'Editar nombre de la credencial',
      continueButton: 'Guardar',
      inputLabel: 'Nombre',
      inputPlaceholder: 'Proporciona un nuevo nombre para esta credencial',
      cancelButton: 'Cancelar'
    },
    copyModal: {
      title: 'Copiar credencial',
      continueButton: 'Confirmar y copiar',
      copyButtonLabel: 'Credencial: ',
      cancelButton: 'Cancelar',
      hiddenCredentialsText: 'Solo podrás copiar esta credencial una vez. Cópiala y guárdala en un lugar seguro.'
    }
  },
  application: {
    breadcrumbMyApps: 'Mis aplicaciones',
    edit: 'Editar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    proceed: 'Continuar',
    applicationName: 'Nombre de la aplicación ',
    authStrategy: translationNeeded(en.application.authStrategy),
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    grantedScopes: translationNeeded(en.application.grantedScopes),
    availableScopes: translationNeeded(en.application.availableScopes),
    filterScopesPlaceholder: translationNeeded(en.application.filterScopesPlaceholder),
    clientID: 'ID de cliente: ',
    clientSecret: 'Clave secreta de cliente: ',
    reqField: ' indica campo obligatorio',
    redirectUriLabel: 'URI de redireccionamiento',
    applicationCredentials: 'Credenciales de la aplicación',
    applicationSecret: 'Clave secreta de la aplicación',
    confirmDelete: (name: any) => `¿Estas seguro que quieres borrar ${name}? Esta acción no se puede deshacer.`,
    description: 'Descripción',
    redirectUri: (uri: string) => `URI de redireccionamiento: ${uri}`,
    referenceId: (id: string) => `ID de referencia: ${id}`,
    form: {
      referenceId: {
        label: 'ID de referencia',
        help: 'Al usar OpenID, debe coincidir con el ID de cliente de la entidad que representa a la aplicación en tu proveedor de identidad.',
        placeholder: 'Proporciona o genera un ID',
        generate: 'Generar'
      }
    },
    headerDescription1: 'Aquí está la información del cliente para tu aplicación llamada ',
    headerDescription2: '. La clave secreta del cliente será ',
    headerDescription3: 'mostrada solamente una vez.',
    headerDescription4: 'Por favor, asegúrate de copiar este valor y guardarlo en un lugar seguro.'
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
    titleProducts: 'Productos',
    showMoreLabel: (items: string) => translationNeeded(en.productList.showMoreLabel(items)),
    actions: {
      unregister: 'Cancelar registro'
    },
    emptyState: {
      titleProducts: 'Sin productos',
      viewCatalog1: 'Ver el catálogo',
      viewCatalog2Product: 'para registrarte a un producto.'
    },
    labels: {
      nameProduct: 'Producto',
      version: 'Versión',
      status: 'Estado',
      actions: 'Acciones'
    }
  },
  dcrAuthentication: {
    authentication: 'Autenticación',
    refreshToken: 'Token de actualización'
  },
  refreshTokenModal: {
    title: 'Clave secreta de la aplicación',
    proceed: 'Continuar',
    description1: 'Esta es la nueva clave secreta para tu aplicación. La clave secreta del cliente ',
    description2: 'será mostrada una vez solamente. ',
    description3: 'Por favor, asegúrate de copiar este valor y guardarlo en un lugar seguro.',
    secret: 'Clave secreta: '
  },
  applicationRegistration: {
    noAvailableApplications: 'Actualmente no hay aplicaciones disponibles para registrarse.',
    noFoundApplications: translationNeeded(en.applicationRegistration.noFoundApplications),
    searchPlaceholder: translationNeeded(en.applicationRegistration.searchPlaceholder),
    filterScopes: translationNeeded(en.applicationRegistration.filterScopes),
    availableScopesLabel: translationNeeded(en.applicationRegistration.availableScopesLabel),
    fetchingScopesLabel: translationNeeded(en.applicationRegistration.fetchingScopesLabel),
    updateScopesWarning: translationNeeded(en.applicationRegistration.updateScopesWarning),
    noApplications: 'No hay aplicaciones',
    selectApplication: 'Seleccionar aplicación',
    createNewApplication: 'Crear aplicación nueva +',
    createApplication: 'Crear aplicación',
    cancelButton: 'Cancelar',
    registeredApplicationsProduct: 'Las siguientes aplicaciones ya están registradas para este producto:',
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => `Registro para ${serviceName} - ${productVersion}`,
      buttonText: 'Soliciar acceso'
    },
    modalApplicationRegistrationStatusIsPending: {
      title: 'Solicitud de acceso pendiente de revisión',
      body: 'Recibirás un correo electrónico en caso de que tu solicitud sea aprobada.',
      buttonText: 'Cerrar'
    }
  },
  defaultForm: {
    missingFields: 'Por favor, rellena todos los campos obligatorios.'
  },
  validationErrors: {
    isEmail: 'El correo electrónico debe ser una dirección de correo electrónico válida'
  },
  apiDocumentation: {
    emptyTitle: translationNeeded(en.apiDocumentation.emptyTitle),
    emptyMessage: translationNeeded(en.apiDocumentation.emptyMessage),
    error: {
      description: 'Ocurrió un error inesperado al intentar cargar el documento. Por favor, inténtalo de nuevo más tarde',
      linkText: 'Regresar al inicio →'
    },
    sections: {
      onThisPage: 'En esta página'
    }
  },
  errorWrapper: {
    linkText: 'Regresar al inicio →'
  },
  sidebar: {
    noVersions: translationNeeded(en.sidebar.noVersions),
    deprecated: ' (Obsoleto)',
    noResultsProduct: 'No hay versiones del producto'
  },
  catalog: {
    entityTypeProduct: 'Producto',
    noResultsProduct: 'No hay productos disponibles'
  },
  catalogItem: {
    latestVersion: 'Última versión: ',
    specificationLink: 'Especificación',
    documentationLink: 'Documentación'
  },
  catalogTable: {
    specificationLink: 'Especificación',
    documentationLink: 'Documentación'
  },
  products: {
    search: 'Buscar',
    searching: 'Buscando...'
  },
  copyButton: {
    clickToCopy: 'Haz clic para copiar',
    copyToClipboard: 'Haz clic para copiar al portapapeles',
    ariaLabel: 'Copiar el contenido del botón al portapapeles',
    copyFailed: {
      start: 'Error al copiar',
      end: 'al portapapeles'
    },
    copySucceeded: {
      start: '"',
      end: '" copiado al portapapeles'
    }
  },
  nav: {
    catalog: 'Catálogo',
    breadcrumbProduct: 'Producto',
    breadcrumbDocumentation: 'Documentación',
    logoAlt: 'logo'
  },
  authCard: {
    logoAlt: 'logo'
  },
  forbidden: {
    logoAlt: 'logo',
    http403: '403',
    goBack: 'Volver',
    sorryMessage: 'Lo sentimos. No estás autorizado para ver esta página.',
    home: 'inicio'
  },
  notFound: {
    http404: '404',
    goBack: 'Volver',
    sorryMessage: 'Lo sentimos. No podemos encontrar la página que estás buscando.',
    home: 'inicio',
    logoAlt: 'logo'
  },
  myApp: {
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    authStrategyFetchError: (errString: string) => translationNeeded(en.myApp.authStrategyFetchError(errString)),
    newApp: 'Nueva aplicación',
    plus: 'Plus',
    myApps: 'Mis aplicaciones',
    refreshSecret: 'Refrescar clave secreta',
    refreshSecretSuccess: translationNeeded(en.myApp.refreshSecretSuccess),
    refreshSecretFailure: (error: string) => translationNeeded(en.myApp.refreshSecretFailure(error)),
    noSearchResults: translationNeeded(en.myApp.noSearchResults),
    searchPlaceholder: translationNeeded(en.myApp.searchPlaceholder),
    delete: 'Eliminar',
    cancel: 'Cancelar',
    noApp: 'No hay aplicaciones',
    create: 'Crear una nueva aplicación',
    getStarted: '  para empezar',
    deleteDialog: (name: string) => `¿Estas seguro que quieres borrar ${name}? Esta acción no se puede deshacer.`,
    deleteSuccess: translationNeeded(en.myApp.deleteSuccess),
    deleteFailure: (str: string) => translationNeeded(en.myApp.deleteFailure(str))
  },
  router: {
    portalTitle: 'Portal de desarrolladores',
    loginTitle: 'Iniciar sesión',
    registrationTitle: 'Registrarse',
    forgotPasswordTitle: 'Olvidé mi contraseña',
    resetPasswordTitle: 'Restablecer contraseña',
    catalogTitleProduct: 'Catálogo de productos',
    specTitle: 'Especificación de la API',
    oauth2RedirectTitle: translationNeeded(en.router.oauth2RedirectTitle),
    docsTitle: 'Documentación de la API',
    appsTitle: 'Mis aplicacione',
    createAppTitle: 'Crear nueva aplicación',
    createAppTitle2: 'Crear aplicación',
    viewAppTitle: 'Aplicación',
    updateAppTitle: 'Actualizar aplicación',
    notFoundTitle: 'No encontrado',
    forbiddenTitle: 'Prohibido',
    errorTitle: 'Error'
  },
  oauth2: {
    authMaybeUnsafe: translationNeeded(en.oauth2.authMaybeUnsafe),
    defaultError: translationNeeded(en.oauth2.defaultError),
    dataNotFound: translationNeeded(en.oauth2.dataNotFound),
    moreInfo: translationNeeded(en.oauth2.moreInfo),
    noDescription: translationNeeded(en.oauth2.noDescription)
  }
}
