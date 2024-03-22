export const en = {
  login: {
    unauthenticated: 'Account could not be authenticated. If you think you are receiving this message in error, please contact your administrator.',
    successText: 'Your email has been confirmed. Awaiting account approval.',
    successButton: 'Okay',
    missingCredentials: 'Please enter your login credentials',
    missingAccount: "Don't have an account?",
    signUp: 'Sign Up'
  },
  forgotPassword: {
    successText: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, please check your spam folder.',
    successButton: 'Return to home page',
    heading: 'Recover Password',
    subHeading: "Enter your user account's verified email address and we will send you a password reset link.",
    placeholderEmail: 'Email',
    buttonIdle: 'Send password reset email',
    buttonSubmitting: 'Submitting',
    missingEmail: 'Please enter your email address'
  },
  resetPassword: {
    successText: 'Password reset successfully.',
    successButton: 'Return to login',
    heading: 'Change Password',
    placeholderPassword: 'Password',
    placeholderConfirmPassword: 'Confirm Password',
    buttonIdle: 'Change Password',
    buttonSubmitting: 'Submitting',
    confirmPasswordFail: 'Passwords must match',
    missingPassword: 'Passwords are required'
  },
  registration: {
    successText: 'Please check your email to confirm your address.',
    alreadyCreated: 'Already have an account?',
    login: 'Log in here'
  },
  productVersion: {
    deprecatedWarningProduct: 'This product version is now deprecated. The endpoints will remain fully usable until this version is sunsetted.',
    unableToRetrieveDoc: 'Unable to retrieve documentation',
    noProductVersionsDetail: 'This App is not registered for any Product Versions',
    noProductVersionsTitle: 'No Product Versions',
    registerProductVersion: 'Register Product version'
  },
  authStrategyInfo: {
    titleLabel: 'Supported Application Auth Strategy:',
    credentialTypeLabel: 'Credential Type:',
    registerBtnText: (productVersionName: string) => `Register for ${productVersionName}`,
    authMethods: 'Auth Methods:',
    keyNames: 'Key Names:',
    bearer: 'Bearer',
    keyAuth: 'Key Auth',
    clientCredentials: 'Client Credentials',
    selfManagedClientCredentials: 'Self Managed',
    session: 'Session'
  },
  userDropdown: {
    myApps: 'My Apps',
    logout: 'Logout'
  },
  sectionOverview: {
    title: 'Overview'
  },
  viewSpecModal: {
    viewSpec: 'View Spec',
    copy: 'Copy',
    download: 'Download',
    close: 'Close',
    copySuccess: 'Copied to clipboard',
    copyError: 'Failed to copy id to clipboard'
  },
  credentials: {
    noCredentialsText: 'No Credentials',
    title: 'Authentication',
    newButtonText: 'Generate Credential',
    copySubheading: 'Credential for ',
    creationModal: {
      title: 'Name for the credential',
      continueButton: 'Generate',
      inputLabel: 'Name',
      inputPlaceholder: 'Provide a name for this credential',
      cancelButton: 'Cancel'
    },
    revokeModal: {
      title: 'Revoke the credential',
      description: {
        start: 'Key ',
        end: ' will be revoked, you cannot undo this action.'
      },
      revokeButton: 'Revoke',
      cancelButton: 'Cancel'
    },
    renameModal: {
      actionLabel: 'Edit',
      title: 'Edit name for the credential',
      continueButton: 'Save',
      inputLabel: 'Name',
      inputPlaceholder: 'Provide a new name for this credential',
      cancelButton: 'Cancel'
    },
    copyModal: {
      title: 'Copy credential',
      continueButton: 'Confirm & Copy',
      copyButtonLabel: 'Credential: ',
      cancelButton: 'Cancel',
      hiddenCredentialsText: 'You will only be able to copy this credential once. Please copy and store it somewhere safe.'
    }
  },
  application: {
    breadcrumbMyApps: 'My Apps',
    edit: 'Edit',
    cancel: 'Cancel',
    delete: 'Delete',
    proceed: 'Proceed',
    applicationName: 'Application Name ',
    authStrategy: 'Auth Strategy',
    authStrategyWarning: 'You cannot create an application as this developer portal has no available application auth strategies. Please contact a developer portal admin.',
    grantedScopes: 'Granted Scopes:',
    availableScopes: 'Available Scopes',
    filterScopesPlaceholder: 'Filter Scopes',
    clientID: 'Client ID: ',
    clientSecret: 'Client Secret: ',
    reqField: ' indicates required field',
    redirectUriLabel: 'Redirect URI',
    applicationCredentials: 'Application Credentials',
    applicationSecret: 'Application Secret',
    confirmDelete: (name: any) => `Are you sure you want to delete ${name}? This action cannot be undone`,
    description: 'Description',
    redirectUri: (uri: string) => `Redirect URI: ${uri}`,
    referenceId: (id: string) => `Reference ID: ${id}`,
    form: {
      referenceId: {
        label: 'Reference ID',
        help: 'Must match with the client ID of the application entity in your identity provider when using OpenID',
        placeholder: 'Enter or generate an ID',
        generate: 'Generate'
      }
    },
    headerDescription1: 'Here is the client information for your application named ',
    headerDescription2: '. The client secret will ',
    headerDescription3: 'only be shown once.',
    headerDescription4: 'Please copy this value and keep for your records.'
  },
  analytics: {
    filterLabelProductVersions: 'Product Versions',
    chartOverview: 'Chart Overview',
    chartTitleRequests: 'Requests by Product Version',
    chartTitleLatency: 'P99 Latency by Product Version',
    chartTitle4xxProductVersion: '4xx by Product Version',
    chartTitle5xxProductVersion: '5xx by Product Version',
    chartTitle4xxStatusCode: '4xx by Status Code',
    chartTitle5xxStatusCode: '5xx by Status Code',
    dashboard: 'Dashboard',
    resultsLimited: 'Not all results shown. Refine your search for more related results.',
    notAvailable: 'Not available',
    sectionCurrent: 'Current',
    sectionLast: 'Last',
    sectionPrevious: 'Previous',
    selectDateRange: 'Please select a date range',
    selectProductVersions: 'Select Product Versions',
    summary: 'Summary',
    summary24Hours: '24 Hours',
    summary30Days: '30 Days',
    summaryTooltip: (timespan: string) => `Showing ${timespan} summary of analytics for all apps`,
    timeRange: 'Time Range',
    totalRequests: 'Total Requests',
    unableToFetch: (itemName: string) => `Unable to fetch ${itemName}`,
    viewAnalytics: 'View analytics'
  },
  productList: {
    titleProducts: 'Products',
    showMoreLabel: (items: string) => `+ ${items} more`,
    actions: {
      unregister: 'Unregister'
    },
    emptyState: {
      titleProducts: 'No Products',
      viewCatalog1: 'View the catalog',
      viewCatalog2Product: 'to register to a product.'
    },
    labels: {
      nameProduct: 'Product',
      version: 'Version',
      status: 'Status',
      actions: 'Actions'
    }
  },
  dcrAuthentication: {
    authentication: 'Authentication',
    refreshToken: 'Refresh Token'
  },
  refreshTokenModal: {
    title: 'Application Secret',
    proceed: 'Proceed',
    description1: 'Here is new secret for your application. The client secret will ',
    description2: 'only be shown once. ',
    description3: 'Please copy this value and keep for your records.',
    secret: 'Secret: '
  },
  applicationRegistration: {
    noAvailableApplications: 'You currently have no applications to register.',
    noFoundApplications: 'You currently have no applications with that name.',
    noApplications: 'No Applications',
    selectApplication: 'Select Application',
    createNewApplication: 'Create new Application +',
    createApplication: 'Create an Application',
    searchPlaceholder: 'Search applications',
    cancelButton: 'Cancel',
    filterScopes: 'Filter...',
    availableScopesLabel: 'Select scopes',
    updateScopesWarning: 'Updating scopes will affect all application registrations related to this application',
    fetchingScopesLabel: 'Fetching scopes...',
    registeredApplicationsProduct: 'The following applications are already registered to this product:',
    modalApplicationRegistrationDefault: {
      title: (serviceName: string, productVersion: string) => `Register for ${serviceName} - ${productVersion}`,
      buttonText: 'Request Access'
    },
    modalApplicationRegistrationStatusIsPending: {
      title: 'Registration Under Review',
      body: 'You will be notified upon approval.',
      buttonText: 'Close'
    }
  },
  defaultForm: {
    missingFields: 'Please complete all required fields'
  },
  validationErrors: {
    isEmail: 'Email must be a valid email address'
  },
  apiDocumentation: {
    emptyTitle: 'No Documentation',
    emptyMessage: 'This product currently has no documentation. Reach out to your Developer Portal administrator if this is not expected.',
    error: {
      description: 'An unexpected error occurred when trying to load the requested document. Please try again later',
      linkText: 'Go back home →'
    },
    sections: {
      onThisPage: 'On this page'
    }
  },
  errorWrapper: {
    linkText: 'Go back home →'
  },
  sidebar: {
    noVersions: 'This product has no published product versions',
    deprecated: ' (Deprecated)',
    noResultsProduct: 'No product versions'
  },
  catalog: {
    entityTypeProduct: 'Product',
    noResultsProduct: 'No Products listed'
  },
  catalogItem: {
    latestVersion: 'Latest Version:',
    specificationLink: 'Specification',
    documentationLink: 'Documentation'
  },
  catalogTable: {
    specificationLink: 'Specification',
    documentationLink: 'Documentation'
  },
  products: {
    search: 'Search',
    searching: 'Searching...'
  },
  copyButton: {
    clickToCopy: 'Click to copy',
    copyToClipboard: 'Copy to clipboard',
    ariaLabel: 'Copy button content to clipboard',
    copyFailed: {
      start: 'Failed to copy',
      end: 'to clipboard'
    },
    copySucceeded: {
      start: '"',
      end: '" copied to clipboard'
    }
  },
  nav: {
    catalog: 'Catalog',
    breadcrumbProduct: 'Product',
    breadcrumbDocumentation: 'Documentation',
    logoAlt: 'logo'
  },
  authCard: {
    logoAlt: 'logo'
  },
  forbidden: {
    logoAlt: 'logo',
    http403: '403',
    goBack: 'Go back',
    sorryMessage: 'Sorry. You are not authorized to view this page.',
    home: 'home'
  },
  notFound: {
    http404: '404',
    goBack: 'Go back',
    sorryMessage: 'Sorry. We cannot find the page you are looking for.',
    home: 'home',
    logoAlt: 'logo'
  },
  myApp: {
    authStrategyWarning: 'You cannot create an application as this developer portal has no available application auth strategies. Please contact a developer portal admin.',
    authStrategyFetchError: (errString: string) => `Error fetching auth strategies: ${errString}`,
    newApp: 'New App',
    plus: 'Plus',
    myApps: 'My Apps',
    refreshSecret: 'Refresh secret',
    refreshSecretSuccess: 'Successfully refreshed secret',
    refreshSecretFailure: (str: string) => `Failed to refresh secret: ${str}`,
    delete: 'Delete',
    cancel: 'Cancel',
    noApp: 'No Applications',
    searchPlaceholder: 'Search applications',
    noSearchResults: 'No Applications Found',
    create: 'Create a new app',
    getStarted: ' to get started',
    deleteDialog: (name: string) => `Are you sure you want to delete ${name}? This action cannot be undone.`,
    deleteSuccess: 'Application successfully deleted',
    deleteFailure: (str: string) => `Failed to delete application: ${str}`
  },
  router: {
    portalTitle: 'Developer Portal',
    loginTitle: 'Log In',
    registrationTitle: 'Registration',
    forgotPasswordTitle: 'Forgot Password',
    resetPasswordTitle: 'Reset Password',
    catalogTitleProduct: 'Product Catalog',
    specTitle: 'API Spec',
    oauth2RedirectTitle: 'OAuth2 Authorization',
    docsTitle: 'API Docs',
    appsTitle: 'My Apps',
    createAppTitle: 'Create New Application',
    createAppTitle2: 'Create Application',
    viewAppTitle: 'Application',
    updateAppTitle: 'Update Application',
    notFoundTitle: 'Not Found',
    forbiddenTitle: 'Forbidden',
    errorTitle: 'Error'
  },
  oauth2: {
    dataNotFound: 'OAuth data not found',
    noDescription: 'No description',
    moreInfo: 'More info: ',
    authMaybeUnsafe: "Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server",
    defaultError: '[Authorization failed]: no accessCode received from the server'
  }
}
