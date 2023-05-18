const projectName = 'portal-vue'

const fs = require('fs')
const path = require('path')

// Read files from the /client/eslint-plugin-portal-vue folder
const ruleFiles = fs
  .readdirSync('eslint-plugin-portal-vue')
  // Exclude index.js and any markdown files
  .filter(file => file !== 'index.js' && !file.endsWith('.md'))

const configs = {
  all: {
    plugins: [projectName],
    rules: Object.fromEntries(
      ruleFiles.map(file => [
        `${projectName}/${path.basename(file, '.js')}`,
        'error'
      ])
    )
  }
}

const rules = Object.fromEntries(
  ruleFiles.map(file => [path.basename(file, '.js'), require('./' + file)])
)

module.exports = { configs, rules }
