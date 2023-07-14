const { defineConfig } = require('cypress')
const cypressSplit = require('cypress-split')
const dotenv = require('dotenv')

dotenv.config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
      require('cypress-terminal-report/src/installLogsPrinter')(on)
      cypressSplit(on, config)

      config.env = {
        ...process.env,
        ...config.env
      }


      // IMPORTANT: return the config object
      return config
    },
    baseUrl: 'http://localhost:8088',
    specPattern: 'cypress/e2e/specs/*.spec.(js|ts)',
    supportFile: 'cypress/e2e/support/index.ts',
    experimentalRunAllSpecs: true
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  fixturesFolder: 'cypress/e2e/fixtures',
  includeShadowDom: true,
  reporter: 'spec',
  screenshotsFolder: 'cypress/e2e/screenshots',
  scrollBehavior: 'center',
  trashAssetsBeforeRuns: false,
  videoCompression: false,
  videosFolder: 'cypress/e2e/videos',
  watchForFileChanges: true
})
