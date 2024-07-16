<!--
CI > modify this readme section to trigger GH Actions
.
-->

[![][kong-logo-url]][kong-url]

# Konnect Dev Portal Client

This repo is a fork of kong Konnect dev portal for showing how to deploy in Azure Static Web Apps and Github Actions

## Getting started

### Using the Project: Best Practices

### Branches

1. **Main Branch (`main`)**: The `main` branch serves as the default branch, and all commits and pull requests should be directed here. It represents the latest version of the project.

2. **Release Branch (`release`)**: The `release` branch includes all the changes from the `main` branch, but its latest commit will always correspond to the latest release tag.



### Prerequisites

* Kong Konnect account
  * You can Start a Free trial at: [konghq.com][kong-konnect-register-url]
  * Documentation for Kong Konnect is available at: [docs.konghq.com][konnect-docs-url]
* Yarn [^1.22.x][yarn-install-url]

Install dependencies

```sh
yarn install --frozen-lockfile
```

Create local .env file

```sh
cp .env.example .env
```

Set `VITE_PORTAL_API_URL` value in your current environment i.e .env file or local environment, this should match either the Kong supplied portal URL ending in `portal.konghq.com` (for local development) or the [custom hosted domain URL set in Konnect][custom-dev-portal-url] (for your deployed environment). Be sure to set the custom self-hosted UI domain to match the domain you will be serving the portal out of to avoid CORS issues.

For Development you can provide any portal API URL, it is proxied by Vite, so you do not need to set the custom client domain.

Run vite dev with

```sh
yarn dev #optional --verbose
```

Run tests with

```sh
yarn test:e2e
```

### Public Directory

If you need to store assets (e.g. fonts, images, or icons), you can create a `public` directory at the root level of the repository and Vite will utilize it by default. For more information on when or how to use the public folder, visit [here](https://vitejs.dev/guide/assets.html#the-public-directory).

## Building for production release

Build production bundle '_(dist/)_' for deployment with

```sh
yarn build
```

### Branch naming conventions

Please follow the following branch naming scheme when creating your branch:

* `feat/foo-bar` for new features
* `fix/foo-bar` for bug fixes
* `test/foo-bar` when the change concerns only the test suite
* `refactor/foo-bar` when refactoring code without any behavior change
* `style/foo-bar` when addressing some style issue
* `docs/foo-bar` for updates to the README.md, this file, or similar documents
* `ci/foo-bar` for updates to the GitHub workflows or actions

## License

```
Copyright 2016-2023 Kong Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

[custom-dev-portal-url]: https://docs.konghq.com/konnect/dev-portal/customization/#custom-dev-portal-url
[kong-konnect-register-url]: https://konghq.com/products/kong-konnect/register?utm_medium=referral&utm_source=github&utm_campaign=gateway-konnect&utm_content=konnect-portal-readme
[portal-api-url]: https://developer.konghq.com/spec/2aad2bcb-8d82-43b3-abdd-1d5e6e84dbd6/b4539157-4ced-4df5-affa-7d790baee356
[kong-logo-url]: https://konghq.com/wp-content/uploads/2018/05/kong-logo-github-readme.png
[kong-url]: https://konghq.com/
[konnect-docs-url]: https://docs.konghq.com/konnect/
[oss-url]: https://en.wikipedia.org/wiki/Open-source_software
[yarn-install-url]: https://classic.yarnpkg.com/lang/en/docs/install
[javascript-sdk-url]: https://www.npmjs.com/package/@kong/sdk-portal-js
