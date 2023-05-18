# eslint-plugin-portal-vue

This local ESLint plugin serves custom rules specific to the Konnect UI application. In theory, we could publish as a standalone package; however, since it's mainly being used as part of our Vue 2.7 and Vue 3 migration path, it's just linked locally for now. It is literraly a copy of `eslint-plugin-konnect-vue` eslint plugin.

## Installation

This plugin is installed in `portal-client/package.json` via a link to the folder via a script in `portal-client/eslint-plugin-portal-vue/index.js`.

## Rules

### Do not allow imports from the deprecated setup root context (vue-setup-context)

#### Correct :white_check_mark:

The proper way to access the `$router` or `$route` instance within a component's `setup` function is done as shown here:

```js
import { useRoute, useRouter } from '@/composables'

setup() {
  const $router = useRouter()
  const $route = useRoute()
  if ($route.name !== 'login') {
    $router.push({ name: 'login' })
  }
}
```

Access the `$store` (or `store`) within a component's `setup` function:

```js
import store from '@/store'
setup() {
  const helpText = store.state.helpText
}
```

#### Incorrect :no_entry_sign:

Previously, you would access the `$router`, `$route`, or `$store` within components from the `setup` context, as shown here:

```js
setup(props, { root: { $router, $route, $store } } ) {
  if ($route.name !== 'login') {
    $router.push({ name: 'login' })
  }

  const helpText = $store.state.helpText
}
```