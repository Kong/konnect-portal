export interface I18nType {
  login: {
    unauthenticated: string;
    successText: string;
    successButton: string;
    missingCredentials: string;
    missingAccount: string;
    signUp: string;
  };
  forgotPassword: {
    successText: string;
    successButton: string;
    heading: string;
    subHeading: string;
    placeholderEmail: string;
    buttonIdle: string;
    buttonSubmitting: string;
    missingEmail: string;
  };
  resetPassword: {
    successText: string;
    successButton: string;
    heading: string;
    placeholderPassword: string;
    placeholderConfirmPassword: string;
    buttonIdle: string;
    buttonSubmitting: string;
    confirmPasswordFail: string;
    missingPassword: string;
  };
  registration: {
    successText: string;
    alreadyCreated: string;
    login: string;
  };
  productVersion: {
    deprecatedWarningProduct: string;
    unableToRetrieveDoc: string;
    noProductVersionsDetail: string;
    noProductVersionsTitle: string;
    registerProductVersion: string;
  };
  authStrategyInfo: {
    titleLabel: string;
    credentialTypeLabel: string;
    registerBtnText: (productVersionName: string) => string;
    authMethods: string;
    keyNames: string;
    bearer: string;
    keyAuth: string;
    clientCredentials: string;
    selfManagedClientCredentials: string;
    session: string;
  };
  userDropdown: {
    myApps: string;
    logout: string;
  };
  sectionOverview: {
    title: string;
  };
  viewSpecModal: {
    viewSpec: string;
    copy: string;
    download: string;
    close: string;
    copySuccess: string;
    copyError: string;
  };
  credentials: {
    noCredentialsText: string;
    title: string;
    newButtonText: string;
    copySubheading: string;
    creationModal: {
      title: string;
      continueButton: string;
      inputLabel: string;
      inputPlaceholder: string;
      cancelButton: string;
    };
    revokeModal: {
      title: string;
      description: {
        start: string;
        end: string;
      };
      revokeButton: string;
      cancelButton: string;
    };
    renameModal: {
      actionLabel: string;
      title: string;
      continueButton: string;
      inputLabel: string;
      inputPlaceholder: string;
      cancelButton: string;
    };
    copyModal: {
      title: string;
      continueButton: string;
      copyButtonLabel: string;
      cancelButton: string;
      hiddenCredentialsText: string;
    };
  };
  application: {
    breadcrumbMyApps: string;
    edit: string;
    cancel: string;
    delete: string;
    proceed: string;
    applicationName: string;
    authStrategy: string;
    authStrategyWarning: string;
    clientID: string;
    clientSecret: string;
    reqField: string;
    grantedScopes: string;
    availableScopes: string;
    filterScopesPlaceholder: string;
    redirectUriLabel: string;
    applicationCredentials: string;
    applicationSecret: string;
    confirmDelete: (name: any) => string;
    description: string;
    redirectUri: (uri: string) => string;
    referenceId: (id: string) => string;
    form: {
      referenceId: {
        label: string;
        help: string;
        placeholder: string;
        generate: string;
      };
    };
    headerDescription1: string;
    headerDescription2: string;
    headerDescription3: string;
    headerDescription4: string;
  };
  analytics: {
    filterLabelProductVersions: string,
    chartOverview: string,
    chartTitleRequests: string,
    chartTitleLatency: string,
    chartTitle4xxProductVersion: string,
    chartTitle5xxProductVersion: string,
    chartTitle4xxStatusCode: string,
    chartTitle5xxStatusCode: string,
    dashboard: string,
    resultsLimited: string,
    notAvailable: string,
    sectionCurrent: string,
    sectionLast: string,
    sectionPrevious: string,
    selectDateRange: string,
    selectProductVersions: string,
    summary: string,
    summary24Hours: string,
    summary30Days: string,
    summaryTooltip: (timespan: string) => string,
    timeRange: string,
    totalRequests: string,
    unableToFetch: (itemName: string) => string,
    viewAnalytics: string,
  },
  productList: {
    titleProducts: string;
    showMoreLabel: (items: string) => string,
    actions: {
      unregister: string;
    };
    emptyState: {
      titleProducts: string;
      viewCatalog1: string;
      viewCatalog2Product: string;
    };
    labels: {
      nameProduct: string;
      version: string;
      status: string;
      actions: string;
    };
  };
  dcrAuthentication: {
    authentication: string;
    refreshToken: string;
  };
  refreshTokenModal: {
    title: string;
    proceed: string;
    description1: string;
    description2: string;
    description3: string;
    secret: string;
  };
  applicationRegistration: {
    noAvailableApplications: string;
    noFoundApplications: string;
    noApplications: string;
    selectApplication: string;
    createNewApplication: string;
    createApplication: string;
    cancelButton: string;
    fetchingScopesLabel: string;
    registeredApplicationsProduct: string;
    searchPlaceholder: string;
    availableScopesLabel: string;
    updateScopesWarning: string;
    filterScopes: string;
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => string;
      buttonText: string;
    };
    modalApplicationRegistrationStatusIsPending: {
      title: string;
      body: string;
      buttonText: string;
    };
  };
  defaultForm: {
    missingFields: string;
  };
  validationErrors: {
    isEmail: string;
  };
  apiDocumentation: {
    emptyTitle: string,
    emptyMessage: string,
    error: {
      description: string;
      linkText: string;
    };
    sections: {
      onThisPage: string;
    };
  };
  errorWrapper: {
    linkText: string;
  };
  sidebar: {
    noVersions: string;
    deprecated: string;
    noResultsProduct: string;
  };
  catalog: {
    entityTypeProduct: string;
    noResultsProduct: string;
  };
  catalogItem: {
    latestVersion: string;
    specificationLink: string;
    documentationLink: string;
  };
  catalogTable: {
    specificationLink: string;
    documentationLink: string;
  };
  products: {
    search: string;
    searching: string;
  };
  copyButton: {
    clickToCopy: string;
    copyToClipboard: string;
    ariaLabel: string;
    copyFailed: {
      start: string;
      end: string;
    };
    copySucceeded: {
      start: string;
      end: string;
    };
  };
  nav: {
    catalog: string;
    breadcrumbProduct: string;
    breadcrumbDocumentation: string;
    logoAlt: string;
  };
  authCard: {
    logoAlt: string;
  };
  forbidden: {
    logoAlt: string;
    http403: string;
    goBack: string;
    sorryMessage: string;
    home: string;
  };
  notFound: {
    http404: string;
    goBack: string;
    sorryMessage: string;
    home: string;
    logoAlt: string;
  };
  myApp: {
    authStrategyWarning: string;
    authStrategyFetchError: (errString: string) => string;
    newApp: string;
    plus: string;
    myApps: string;
    refreshSecret: string;
    refreshSecretSuccess: string;
    refreshSecretFailure: (error:string) => string;
    delete: string;
    cancel: string;
    searchPlaceholder: string;
    noSearchResults: string;
    noApp: string;
    create: string;
    getStarted: string;
    deleteDialog: (name: string) => string;
    deleteSuccess: string;
    deleteFailure: (str: string) => string;
  };
  router: {
    portalTitle: string;
    loginTitle: string;
    registrationTitle: string;
    forgotPasswordTitle: string;
    resetPasswordTitle: string;
    catalogTitleProduct: string;
    specTitle: string;
    oauth2RedirectTitle: string;
    docsTitle: string;
    appsTitle: string;
    createAppTitle: string;
    createAppTitle2: string;
    viewAppTitle: string;
    updateAppTitle: string;
    notFoundTitle: string;
    forbiddenTitle: string;
    errorTitle: string;
  };
  oauth2: {
    dataNotFound: string;
    noDescription: string;
    moreInfo: string;
    authMaybeUnsafe: string;
    defaultError: string;
  }
}
