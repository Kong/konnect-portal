import { I18nType } from './i18n-type'
import { translationNeeded } from '@/locales/index'
import { en } from '@/locales/en'

export const de: I18nType = {
  login: {
    unauthenticated: 'Authentifizierung nicht erfolgreich. Wenn Sie denken, dass Sie diese Nachricht fälschlicherweise erhalten, wenden Sie sich bitte an Ihren Administrator.',
    successText: 'Ihre E-Mail-Adresse wurde bestätigt. Warten auf die Kontobestätigung.',
    successButton: 'OK',
    missingCredentials: 'Bitte Ihre Zugangsdaten eingeben',
    missingAccount: 'Noch kein Konto?',
    signUp: 'Registrieren'
  },
  forgotPassword: {
    successText: 'Bitte überprüfen Sie Ihre E-Mails auf einen Link zum Zurücksetzen Ihres Passworts. Wenn er nicht innerhalb weniger Minuten angezeigt wird, überprüfen Sie bitte Ihren Spam-Ordner.',
    successButton: 'Zurück zur Startseite',
    heading: 'Passwort wiederherstellen',
    subHeading: 'Geben Sie die E-Mail-Adresse deines Benutzerkontos ein und wir senden Ihnen einen Link zum Zurücksetzen deines Passworts.',
    placeholderEmail: 'E-Mail',
    buttonIdle: 'E-Mail zum Zurücksetzen des Passworts senden',
    buttonSubmitting: 'Absenden',
    missingEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein'
  },
  resetPassword: {
    successText: 'Ihr Passwort wurde erfolgreich zurückgesetzt.',
    successButton: 'Zurück zur Anmeldung',
    heading: 'Passwort ändern',
    placeholderPassword: 'Passwort',
    placeholderConfirmPassword: 'Passwort wiederholen',
    buttonIdle: 'Passwort ändern',
    buttonSubmitting: 'Absenden',
    confirmPasswordFail: 'Die Passwörter müssen übereinstimmen',
    missingPassword: 'Passwort darf nicht leer sein'
  },
  registration: {
    successText: 'Bitte überprüfen Sie Ihre E-Mails, um Ihre Adresse zu bestätigen.',
    alreadyCreated: 'Besitzen Sie bereits ein Konto?',
    login: 'Hier anmelden'
  },
  productVersion: {
    deprecatedWarningProduct: 'Diese Produktversion ist veraltet. Die Endpunkte bleiben voll funktionsfähig, bis diese Version eingestellt wird.',
    unableToRetrieveDoc: 'Keine Dokumentation verfügbar',
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
    myApps: 'Meine Applikationen',
    logout: 'Abmelden'
  },
  sectionOverview: {
    title: 'Übersicht'
  },
  viewSpecModal: {
    viewSpec: 'Spezifikation ansehen',
    copy: 'Kopieren',
    download: 'Herunterladen',
    close: 'Schließen',
    copySuccess: 'In die Zwischenablage kopiert',
    copyError: 'ID konnte nicht in die Zwischenablage kopiert werden'
  },
  credentials: {
    noCredentialsText: 'Keine Zugangsdaten',
    title: 'Authentifizierung',
    newButtonText: 'Zugangsdaten generieren',
    copySubheading: 'Zugangsdaten für ',
    creationModal: {
      title: 'Name für die Zugangsdaten',
      continueButton: 'Generieren',
      inputLabel: 'Name',
      inputPlaceholder: 'Bitte Namen für die Zugangsdaten angeben',
      cancelButton: 'Abbruch'
    },
    revokeModal: {
      title: 'Zugangsdaten widerrufen',
      description: {
        start: 'Schlüssel',
        end: ' wird widerrufen, diese Aktion kann nicht rückgängig gemacht werden.'
      },
      revokeButton: 'Widerrufen',
      cancelButton: 'Abbruch'
    },
    renameModal: {
      actionLabel: 'Bearbeiten',
      title: 'Name für die Zugangsdaten bearbeiten',
      continueButton: 'Speichern',
      inputLabel: 'Name',
      inputPlaceholder: 'Neuer Name für die Zugangsdaten',
      cancelButton: 'Abbruch'
    },
    copyModal: {
      title: 'Zugangsdaten kopieren',
      continueButton: 'Bestätigen und kopieren',
      copyButtonLabel: 'Zugangsdaten: ',
      cancelButton: 'Abbruch',
      hiddenCredentialsText: 'Die Zugangsdaten werden nur einmal angezeigt. Bitte kopieren und an einem sicheren Ort speichern.'
    }
  },
  application: {
    breadcrumbMyApps: 'Meine Applikationen',
    edit: 'Bearbeiten',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    proceed: 'Weiter',
    applicationName: 'Name der Applikation',
    authStrategy: translationNeeded(en.application.authStrategy),
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    grantedScopes: translationNeeded(en.application.grantedScopes),
    availableScopes: translationNeeded(en.application.availableScopes),
    filterScopesPlaceholder: translationNeeded(en.application.filterScopesPlaceholder),
    clientID: translationNeeded(en.application.clientID),
    clientSecret: translationNeeded(en.application.clientSecret),
    reqField: ' Pflichtfeld',
    redirectUriLabel: 'Redirect URI',
    applicationCredentials: 'Zugangsdaten der Applikation',
    applicationSecret: 'Applikation Secret',
    confirmDelete: (name: any) => `Sind Sie sicher, dass Sie ${name} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`,
    description: 'Beschreibung',
    redirectUri: (uri: string) => `Redirect URI: ${uri}`,
    referenceId: (id: string) => `Reference ID: ${id}`,
    form: {
      referenceId: {
        label: 'Reference ID',
        help: 'Die Reference ID muss mit der Client ID der Applikation übereinstimmen, wenn Sie OpenID verwenden',
        placeholder: 'ID eingeben oder generieren',
        generate: 'Generieren'
      }
    },
    headerDescription1: 'Client-Infimationen für Ihre Applikation ',
    headerDescription2: '. Das Client Secret wird ',
    headerDescription3: 'nur einmal angezeigt.',
    headerDescription4: 'Bitte kopieren und an einem sicheren Ort speichern.'
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
    titleProducts: 'Produkte',
    showMoreLabel: (items: string) => translationNeeded(en.productList.showMoreLabel(items)),
    actions: {
      unregister: 'Registrierung aufheben'
    },
    emptyState: {
      titleProducts: 'Keine Produkte',
      viewCatalog1: 'Katalog ansehen, um sich für ein',
      viewCatalog2Product: ' Produkt zu registrieren.'
    },
    labels: {
      nameProduct: 'Produkt',
      version: 'Version',
      status: 'Status',
      actions: 'Aktionen'
    }
  },
  dcrAuthentication: {
    authentication: 'Authentifizierung',
    refreshToken: 'Token erneuern'
  },
  refreshTokenModal: {
    title: 'Secret der Applikation',
    proceed: 'Weiter',
    description1: 'Hier ist das neue Secret für Ihre Applikation. Das Client Secret wird ',
    description2: 'nur einmal angezeigt. ',
    description3: 'Bitte kopieren und an einem sicheren Ort speichern.',
    secret: 'Secret: '
  },
  applicationRegistration: {
    noAvailableApplications: 'Aktuell haben Sie noch keine Applikationen registriert.',
    noFoundApplications: translationNeeded(en.applicationRegistration.noFoundApplications),
    searchPlaceholder: translationNeeded(en.applicationRegistration.searchPlaceholder),
    filterScopes: translationNeeded(en.applicationRegistration.filterScopes),
    availableScopesLabel: translationNeeded(en.applicationRegistration.availableScopesLabel),
    fetchingScopesLabel: translationNeeded(en.applicationRegistration.fetchingScopesLabel),
    updateScopesWarning: translationNeeded(en.applicationRegistration.updateScopesWarning),
    noApplications: 'Keine Applikationen',
    selectApplication: 'Applikation auswählen',
    createNewApplication: 'Neue Applikation anlegen +',
    createApplication: 'Neue Applikation anlegen',
    cancelButton: 'Abbruch',
    registeredApplicationsProduct: 'Die folgenden Applikationen sind bereits für dieses Produkt registriert:',
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => `Für ${serviceName} - ${productVersion} registrieren`,
      buttonText: 'Zugriff anfragen'
    },
    modalApplicationRegistrationStatusIsPending: {
      title: 'Anfrage zur Registrierung für diesen Service wird geprüft',
      body: 'Sie werden benachrichtigt, sobald die Anfrage genehmigt wurde.',
      buttonText: 'Schließen'
    }
  },
  defaultForm: {
    missingFields: 'Bitte alle Pflichtfelder ausfüllen'
  },
  validationErrors: {
    isEmail: 'E-Mail ist ungültig'
  },
  apiDocumentation: {
    emptyTitle: translationNeeded(en.apiDocumentation.emptyTitle),
    emptyMessage: translationNeeded(en.apiDocumentation.emptyMessage),
    error: {
      description: 'Ein unerwarteter Fehler ist aufgetreten, als versucht wurde, das angeforderte Dokument zu laden. Bitte versuchen Sie es später noch einmal',
      linkText: 'Zurück zum Start →'
    },
    sections: {
      onThisPage: 'Auf dieser Seite'
    }
  },
  errorWrapper: {
    linkText: 'Zurück zum Start →'
  },
  sidebar: {
    noVersions: translationNeeded(en.sidebar.noVersions),
    deprecated: ' (Veraltet)',
    noResultsProduct: 'Keine Produktversionen'
  },
  catalog: {
    entityTypeProduct: 'Produkt',
    noResultsProduct: 'Keine Produkte gefunden'
  },
  catalogItem: {
    latestVersion: 'Aktuelle Version:',
    specificationLink: 'Spezifikation',
    documentationLink: 'Dokumentation'
  },
  catalogTable: {
    specificationLink: 'Spezifikation',
    documentationLink: 'Dokumentation'
  },
  products: {
    search: 'Suche',
    searching: 'Suchen...'
  },
  copyButton: {
    clickToCopy: 'Zum Kopieren klicken',
    copyToClipboard: 'In die Zwischenablage kopieren',
    ariaLabel: 'Inhalt in die Zwischenablage kopieren',
    copyFailed: {
      start: 'Kopiervorgang fehlgeschlagen:',
      end: ''
    },
    copySucceeded: {
      start: '"',
      end: '" in die Zwischenablage kopiert'
    }
  },
  nav: {
    catalog: 'Katalog',
    breadcrumbProduct: 'Produkt',
    breadcrumbDocumentation: 'Dokumentation',
    logoAlt: 'Logo'
  },
  authCard: {
    logoAlt: 'Logo'
  },
  forbidden: {
    logoAlt: 'Logo',
    http403: '403',
    goBack: 'Zurück',
    sorryMessage: 'Sie sind nicht berechtigt, diese Seite anzuzeigen.',
    home: 'Startseite'
  },
  notFound: {
    http404: '404',
    goBack: 'Zurück',
    sorryMessage: 'Die Seite, die Sie suchen, wurde nicht gefunden.',
    home: 'Startseite',
    logoAlt: 'Logo'
  },
  myApp: {
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    authStrategyFetchError: (errString: string) => translationNeeded(en.myApp.authStrategyFetchError(errString)),
    newApp: 'Neue Applikation',
    plus: 'Plus',
    myApps: 'Meine Applikationen',
    refreshSecret: 'Secret erneuern',
    refreshSecretSuccess: translationNeeded(en.myApp.refreshSecretSuccess),
    refreshSecretFailure: (error: string) => translationNeeded(en.myApp.refreshSecretFailure(error)),
    noSearchResults: translationNeeded(en.myApp.noSearchResults),
    searchPlaceholder: translationNeeded(en.myApp.searchPlaceholder),
    delete: 'Löschen',
    cancel: 'Abbrechen',
    noApp: 'Keine Applikationen',
    create: 'Neue Applikation anlegen',
    getStarted: ' um loszulegen',
    deleteDialog: (name: string) => `Sind Sie sicher, dass Sie ${name} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`,
    deleteSuccess: translationNeeded(en.myApp.deleteSuccess),
    deleteFailure: (str: string) => translationNeeded(en.myApp.deleteFailure(str))
  },
  router: {
    portalTitle: 'Entwicklerportal',
    loginTitle: 'Anmeldung',
    registrationTitle: 'Registrierung',
    forgotPasswordTitle: 'Passwort vergessen',
    resetPasswordTitle: 'Passwort zurücksetzen',
    catalogTitleProduct: 'Produktkatalog',
    specTitle: 'API Spezifikation',
    oauth2RedirectTitle: translationNeeded(en.router.oauth2RedirectTitle),
    docsTitle: 'API Dokumentation',
    appsTitle: 'Meine Applikationen',
    createAppTitle: 'Neue Applikation anlegen',
    createAppTitle2: 'Applikation erstellen',
    viewAppTitle: 'Applikation',
    updateAppTitle: 'Applikation bearbeiten',
    notFoundTitle: 'Nicht gefunden',
    forbiddenTitle: 'Zugriff verweigert',
    errorTitle: 'Fehler'
  },
  oauth2: {
    dataNotFound: translationNeeded(en.oauth2.dataNotFound),
    moreInfo: translationNeeded(en.oauth2.moreInfo),
    noDescription: translationNeeded(en.oauth2.noDescription),
    authMaybeUnsafe: translationNeeded(en.oauth2.authMaybeUnsafe),
    defaultError: translationNeeded(en.oauth2.defaultError)
  }
}
