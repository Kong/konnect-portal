const DEFAULT_TIMEOUT = 5000

export default {
  data () {
    return {
      toaster: {
        appearance: 'success',
        message: ''
      },
      successToaster: {
        appearance: 'success',
        message: 'success',
        timeoutMilliseconds: DEFAULT_TIMEOUT
      },
      errorToaster: {
        appearance: 'danger',
        message: 'error',
        timeoutMilliseconds: DEFAULT_TIMEOUT
      }
    }
  },

  methods: {
    showToaster (toasterConfig, tmanager) {
      tmanager.open(toasterConfig)
    }
  }
}
