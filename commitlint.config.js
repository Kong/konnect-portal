module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)], // from https://github.com/dependabot/dependabot-core/issues/2445#issuecomment-949633412
  rules: {
    'header-max-length': [2, 'always', 108]
  }
}
