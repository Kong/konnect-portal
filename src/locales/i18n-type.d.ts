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
    clientID: string;
    clientSecret: string;
    reqField: string;
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
  productList: {
    titleProducts: string;
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
    noApplications: string;
    selectApplication: string;
    createNewApplication: string;
    createApplication: string;
    cancelButton: string;
    registeredApplicationsProduct: string;
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
    newApp: string;
    plus: string;
    myApps: string;
    refreshSecret: string;
    delete: string;
    cancel: string;
    noApp: string;
    create: string;
    getStarted: string;
    deleteDialog: (name: string) => string;
  };
  router: {
    portalTitle: string;
    loginTitle: string;
    registrationTitle: string;
    forgotPasswordTitle: string;
    resetPasswordTitle: string;
    catalogTitleProduct: string;
    specTitle: string;
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
}
