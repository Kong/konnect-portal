module.exports = {
  extends: [
    '../../.eslintrc.js'
  ],
  plugins: [
    'cypress'
  ],
  env: {
    mocha: true,
    'cypress/globals': true
  }
}
