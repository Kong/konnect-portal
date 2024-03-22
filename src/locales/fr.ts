import { I18nType } from './i18n-type'
import { translationNeeded } from '@/locales/index'
import { en } from '@/locales/en'

export const fr: I18nType = {
  login: {
    unauthenticated: "Le compte n'a pas pu être authentifié. Si vous pensez recevoir ce message par erreur, veuillez contacter votre administrateur.",
    successText: 'Votre adresse e-mail a été confirmée. En attente d\'approbation du compte.',
    successButton: 'OK',
    missingCredentials: 'Veuillez entrer vos identifiants de connexion',
    missingAccount: "Vous n'avez pas de compte ?",
    signUp: 'S\'inscrire'
  },
  forgotPassword: {
    successText: 'Vérifiez votre e-mail pour obtenir un lien de réinitialisation de votre mot de passe. S\'il n\'apparaît pas dans quelques minutes, veuillez vérifier votre dossier de courriers indésirables.',
    successButton: 'Retour à la page d\'accueil',
    heading: 'Récupérer le mot de passe',
    subHeading: "Saisissez l'adresse e-mail vérifiée de votre compte utilisateur et nous vous enverrons un lien de réinitialisation de mot de passe.",
    placeholderEmail: 'E-mail',
    buttonIdle: 'Envoyer un e-mail de réinitialisation du mot de passe',
    buttonSubmitting: 'Envoi en cours',
    missingEmail: 'Veuillez entrer votre adresse e-mail'
  },
  resetPassword: {
    successText: 'Réinitialisation du mot de passe réussie.',
    successButton: 'Retour à la page de connexion',
    heading: 'Changer de mot de passe',
    placeholderPassword: 'Mot de passe',
    placeholderConfirmPassword: 'Confirmer le mot de passe',
    buttonIdle: 'Changer de mot de passe',
    buttonSubmitting: 'Envoi en cours',
    confirmPasswordFail: 'Les mots de passe doivent correspondre',
    missingPassword: 'Les mots de passe sont requis'
  },
  registration: {
    successText: 'Veuillez vérifier votre e-mail pour confirmer votre adresse.',
    alreadyCreated: 'Avez-vous déjà un compte ?',
    login: 'Se connecter ici'
  },
  productVersion: {
    deprecatedWarningProduct: 'Cette version du produit est maintenant obsolète. Les points d\'accès resteront entièrement utilisables jusqu\'à la fin de cette version.',
    unableToRetrieveDoc: 'Impossible de récupérer la documentation',
    noProductVersionsDetail: 'Cette application n\'est reliée à aucune version produit',
    noProductVersionsTitle: 'Aucune version de produit',
    registerProductVersion: 'Enregistrer une version de produit'
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
    myApps: 'Mes Applications',
    logout: 'Déconnexion'
  },
  sectionOverview: {
    title: 'Aperçu'
  },
  viewSpecModal: {
    viewSpec: 'Voir la spécification',
    copy: 'Copier',
    download: 'Télécharger',
    close: 'Fermer',
    copySuccess: 'Copié dans le presse-papiers',
    copyError: "Échec de la copie de l'identifiant dans le presse-papiers"
  },
  credentials: {
    noCredentialsText: 'Aucun identifiant',
    title: 'Authentification',
    newButtonText: 'Générer un identifiant',
    copySubheading: 'Identifiant pour ',
    creationModal: {
      title: 'Nom de l\'identifiant',
      continueButton: 'Générer',
      inputLabel: 'Nom',
      inputPlaceholder: 'Indiquez un nom pour cet identifiant',
      cancelButton: 'Annuler'
    },
    revokeModal: {
      title: 'Révoquer l\'identifiant',
      description: {
        start: 'La clé ',
        end: ' sera révoquée, cette action est irréversible.'
      },
      revokeButton: 'Révoquer',
      cancelButton: 'Annuler'
    },
    renameModal: {
      actionLabel: 'Modifier',
      title: 'Modifier le nom de l\'identifiant',
      continueButton: 'Enregistrer',
      inputLabel: 'Nom',
      inputPlaceholder: 'Indiquez un nouveau nom pour cet identifiant',
      cancelButton: 'Annuler'
    },
    copyModal: {
      title: 'Copier l\'identifiant',
      continueButton: 'Confirmer et copier',
      copyButtonLabel: 'Identifiant : ',
      cancelButton: 'Annuler',
      hiddenCredentialsText: 'Vous ne pourrez copier cet identifiant qu\'une seule fois. Veuillez le copier et le conserver en lieu sûr.'
    }
  },
  application: {
    breadcrumbMyApps: 'Mes Applications',
    edit: 'Modifier',
    cancel: 'Annuler',
    delete: 'Supprimer',
    proceed: 'Continuer',
    applicationName: 'Nom de l\'application ',
    authStrategy: translationNeeded(en.application.authStrategy),
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    grantedScopes: translationNeeded(en.application.grantedScopes),
    availableScopes: translationNeeded(en.application.availableScopes),
    filterScopesPlaceholder: translationNeeded(en.application.filterScopesPlaceholder),
    clientID: 'Client ID : ',
    clientSecret: 'Client Secret : ',
    reqField: ' indique un champ obligatoire',
    redirectUriLabel: 'URI de redirection',
    applicationCredentials: 'Identifiants de l\'application',
    applicationSecret: 'Secret de l\'application',
    confirmDelete: (name: any) => `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`,
    description: 'Description',
    redirectUri: (uri: string) => `URI de redirection : ${uri}`,
    referenceId: (id: string) => `ID de référence : ${id}`,
    form: {
      referenceId: {
        label: 'ID de référence',
        help: 'Doit correspondre à l\'identifiant client de l\'entité de l\'application dans votre fournisseur d\'identité lorsque vous utilisez OpenID',
        placeholder: 'Saisisser ou générer un ID',
        generate: 'Générer'
      }
    },
    headerDescription1: 'Voici les informations client de votre application nommée ',
    headerDescription2: '. Le secret client ne sera ',
    headerDescription3: 'affiché qu\'une seule fois.',
    headerDescription4: 'Veuillez copier cette valeur et la conserver dans vos archives.'
  },
  analytics: {
    filterLabelProductVersions: translationNeeded(en.analytics.filterLabelProductVersions),
    chartOverview: translationNeeded(en.analytics.chartOverview),
    chartTitleRequests: 'Requêtes par version de produit',
    chartTitleLatency: 'Latence P99 par version de produit',
    chartTitle4xxProductVersion: '4xx par version de produit',
    chartTitle5xxProductVersion: '5xx par version de produit',
    chartTitle4xxStatusCode: '4xx par Status Code',
    chartTitle5xxStatusCode: '5xx par Status Code',
    dashboard: 'Tableau de bord',
    resultsLimited: translationNeeded(en.analytics.resultsLimited),
    notAvailable: 'Indisponible',
    sectionCurrent: 'Courant',
    sectionLast: 'Dernier',
    sectionPrevious: 'Précédent',
    selectDateRange: 'Sélectionnez une plage de dates',
    selectProductVersions: translationNeeded(en.analytics.selectProductVersions),
    summary: 'Résumé',
    summary24Hours: '24 Heures',
    summary30Days: '30 Jours',
    summaryTooltip: (timespan: string) => translationNeeded(en.analytics.summaryTooltip(timespan)),
    timeRange: translationNeeded(en.analytics.timeRange),
    totalRequests: 'Total requêtes',
    unableToFetch: (itemName: string) => translationNeeded(en.analytics.unableToFetch(itemName)),
    viewAnalytics: translationNeeded(en.analytics.viewAnalytics)
  },
  productList: {
    titleProducts: 'Produits',
    showMoreLabel: (items: string) => translationNeeded(en.productList.showMoreLabel(items)),
    actions: {
      unregister: 'Désenregistrer'
    },
    emptyState: {
      titleProducts: 'Aucun produit',
      viewCatalog1: 'Voir le catalogue',
      viewCatalog2Product: 'pour vous inscrire à un produit.'
    },
    labels: {
      nameProduct: 'Produit',
      version: 'Version',
      status: 'Statut',
      actions: 'Actions'
    }
  },
  dcrAuthentication: {
    authentication: 'Authentification',
    refreshToken: 'Jeton de rafraîchissement'
  },
  refreshTokenModal: {
    title: 'Secret de l\'application',
    proceed: 'Continuer',
    description1: 'Voici le nouveau secret pour votre application. Le secret client ne sera ',
    description2: 'affiché qu\'une seule fois. ',
    description3: 'Veuillez copier cette valeur et la conserver dans vos archives.',
    secret: 'Secret : '
  },
  applicationRegistration: {
    noAvailableApplications: 'Vous n\'avez actuellement aucune application à enregistrer.',
    noFoundApplications: translationNeeded(en.applicationRegistration.noFoundApplications),
    searchPlaceholder: translationNeeded(en.applicationRegistration.searchPlaceholder),
    filterScopes: translationNeeded(en.applicationRegistration.filterScopes),
    availableScopesLabel: translationNeeded(en.applicationRegistration.availableScopesLabel),
    fetchingScopesLabel: translationNeeded(en.applicationRegistration.fetchingScopesLabel),
    updateScopesWarning: translationNeeded(en.applicationRegistration.updateScopesWarning),
    noApplications: 'Aucune application',
    selectApplication: 'Sélectionner une application',
    createNewApplication: 'Créer une nouvelle application +',
    createApplication: 'Créer une application',
    cancelButton: 'Annuler',
    registeredApplicationsProduct: 'Les applications suivantes sont déjà enregistrées pour ce produit :',
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => `Inscription à ${serviceName} - ${productVersion}`,
      buttonText: 'Demander l\'accès'
    },
    modalApplicationRegistrationStatusIsPending: {
      title: 'Inscription en cours de révision',
      body: 'Vous serez informé de l\'approbation.',
      buttonText: 'Fermer'
    }
  },
  defaultForm: {
    missingFields: 'Veuillez remplir tous les champs obligatoires'
  },
  validationErrors: {
    isEmail: 'L\'adresse e-mail doit être valide'
  },
  apiDocumentation: {
    emptyTitle: 'Pas de documentation',
    emptyMessage: 'Ce produit n\'as pas encore de documentation. Contactez l\'administrateur du Portail développeur si cela n\'est pas le résultat attendu.',
    error: {
      description: 'Une erreur inattendue s\'est produite lors du chargement du document demandé. Veuillez réessayer ultérieurement.',
      linkText: 'Retourner à la page d\'accueil →'
    },
    sections: {
      onThisPage: 'Sur cette page'
    }
  },
  errorWrapper: {
    linkText: 'Retour à la page d\'accueil →'
  },
  sidebar: {
    noVersions: 'Ce produit n\'a pas de version produit publié',
    deprecated: ' (Obsolète)',
    noResultsProduct: 'Aucune version de produit'
  },
  catalog: {
    entityTypeProduct: 'Produit',
    noResultsProduct: 'Aucun produit répertorié'
  },
  catalogItem: {
    latestVersion: 'Dernière version :',
    specificationLink: 'Spécification',
    documentationLink: 'Documentation'
  },
  catalogTable: {
    specificationLink: 'Spécification',
    documentationLink: 'Documentation'
  },
  products: {
    search: 'Rechercher',
    searching: 'Recherche en cours...'
  },
  copyButton: {
    clickToCopy: 'Cliquer pour copier',
    copyToClipboard: 'Copier dans le presse-papiers',
    ariaLabel: 'Copier le contenu du bouton dans le presse-papiers',
    copyFailed: {
      start: 'Échec de la copie',
      end: 'dans le presse-papiers'
    },
    copySucceeded: {
      start: '"',
      end: '" copié dans le presse-papiers'
    }
  },
  nav: {
    catalog: 'Catalogue',
    breadcrumbProduct: 'Produit',
    breadcrumbDocumentation: 'Documentation',
    logoAlt: 'logo'
  },
  authCard: {
    logoAlt: 'logo'
  },
  forbidden: {
    logoAlt: 'logo',
    http403: '403',
    goBack: 'Retour',
    sorryMessage: 'Désolé. Vous n\'êtes pas autorisé à afficher cette page.',
    home: 'accueil'
  },
  notFound: {
    http404: '404',
    goBack: 'Retour',
    sorryMessage: 'Désolé. Nous ne trouvons pas la page que vous recherchez.',
    home: 'accueil',
    logoAlt: 'logo'
  },
  myApp: {
    authStrategyWarning: translationNeeded(en.application.authStrategyWarning),
    authStrategyFetchError: (errString: string) => translationNeeded(en.myApp.authStrategyFetchError(errString)),
    newApp: 'Nouvelle application',
    plus: 'Plus',
    myApps: 'Mes applications',
    refreshSecret: 'Actualiser le secret',
    refreshSecretSuccess: translationNeeded(en.myApp.refreshSecretSuccess),
    refreshSecretFailure: (error: string) => translationNeeded(en.myApp.refreshSecretFailure(error)),
    noSearchResults: translationNeeded(en.myApp.noSearchResults),
    searchPlaceholder: translationNeeded(en.myApp.searchPlaceholder),
    delete: 'Supprimer',
    cancel: 'Annuler',
    noApp: 'Aucune application',
    create: 'Créer une nouvelle application',
    getStarted: ' pour commencer',
    deleteDialog: (name: string) => `Voulez-vous vraiment supprimer ${name} ? Cette action est irréversible.`,
    deleteSuccess: translationNeeded(en.myApp.deleteSuccess),
    deleteFailure: (str: string) => translationNeeded(en.myApp.deleteFailure(str))
  },
  router: {
    portalTitle: 'Portail développeur',
    loginTitle: 'Connexion',
    registrationTitle: 'Inscription',
    forgotPasswordTitle: 'Mot de passe oublié',
    resetPasswordTitle: 'Réinitialisation du mot de passe',
    catalogTitleProduct: 'Catalogue des produits',
    specTitle: 'Spécification de l\'API',
    oauth2RedirectTitle: translationNeeded(en.router.oauth2RedirectTitle),
    docsTitle: 'Documentation de l\'API',
    appsTitle: 'Mes applications',
    createAppTitle: 'Créer une nouvelle application',
    createAppTitle2: 'Créer une application',
    viewAppTitle: 'Application',
    updateAppTitle: 'Mettre à jour l\'application',
    notFoundTitle: 'Page non trouvée',
    forbiddenTitle: 'Accès interdit',
    errorTitle: 'Erreur'
  },
  oauth2: {
    authMaybeUnsafe: translationNeeded(en.oauth2.authMaybeUnsafe),
    defaultError: translationNeeded(en.oauth2.defaultError),
    dataNotFound: translationNeeded(en.oauth2.dataNotFound),
    moreInfo: translationNeeded(en.oauth2.moreInfo),
    noDescription: translationNeeded(en.oauth2.noDescription)
  }
}
