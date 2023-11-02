[![][kong-logo-url]][kong-url]

![Stars](https://img.shields.io/github/stars/Kong/konnect-portal?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Kong/konnect-portal?style=flat-square)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Deploy Example App](https://github.com/Kong/konnect-portal/actions/workflows/github-pages.yml/badge.svg?branch=main)](https://github.com/Kong/konnect-portal/actions/workflows/github-pages.yml)
[![Semantic Release](https://github.com/Kong/konnect-portal/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/Kong/konnect-portal/actions/workflows/release.yml)
![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)

![Twitter Follow](https://img.shields.io/twitter/follow/thekonginc?style=social)

# Konnect Dev Portal Client

This repo is an [open source][oss-url] reference implementation of a Konnect Developer Portal Client leveraging the [Konnect Developer Portal Client API][portal-api-url] and [JavaScript SDK][javascript-sdk-url].

The [Konnect Dev Portal][konnect-docs-url] is a web application for developers to locate, access, and consume API services. The Dev Portal enables developers to browse and search API documentation, test API endpoints, and manage their own credentials.

In [Kong Konnect][kong-konnect-register-url], you have two hosting options for the Dev Portal web user interface: a cloud hosted Dev Portal with Konnect or a self-hosted, open source Dev Portal powered by Konnect APIs.

Check out the [example app](https://konnect-portal.konghq.com/) to get an idea of what this client app looks like out-of-the-box.

## Self-hosted Dev Portal benefits

There are several benefits to keep in mind when deciding whether to use a Konnect-hosted or self-hosted Dev Portal. The self-hosted portal provides the following benefits:

* Fully customizable: Use the example frontend Dev Portal application as a starting point and then customize Dev Portal for your needs using the Portal API. You can also integrate the API specs with workflows tailored to your organization’s own processes.
* Hosting service choice: When you self-host, you also get to choose which hosting service you use to deploy your Dev Portal.
* Range of customization options: With the self-hosted Dev Portal, you determine how much you want to customize. You can choose to use the example application right out of the box or you can use the Portal API to have more fine-grained control.
* Configurable internationalization
* Automated front-end test suite powered by Cypress

With those benefits in mind, there _is_ the hosting cost to deploy this single page portal and you may need developer/designer support to fully customize this modern web-application to meet your business requirements.

## Getting started

### Using the Project: Best Practices

### Branches

1. **Main Branch (`main`)**: The `main` branch serves as the default branch, and all commits and pull requests should be directed here. It represents the latest version of the project.

2. **Release Branch (`release`)**: The `release` branch includes all the changes from the `main` branch, but its latest commit will always correspond to the latest release tag.

### Choosing the Right Branch

When contributing or using the project, it is essential to understand which branch best suits your needs:

1. **For Contributors**:

* If you want to contribute any new features or bug fixes, please create a new branch based on the `main` branch. Name your branch descriptively ([see the branch naming conventions](#branch-naming-conventions) - Open a pull request to merge your changes into the `main` branch. This allows the maintainers to review your code before merging it into the default branch.

2. **For Users Who Want Frequent Updates**:

* If you prefer to use the latest development version of the project, you should use the `main` branch directly, either in your fork or as a submodule of your project.

3. **For Users Who Want Stable Releases**:

* Use the `release` branch if you prefer less-frequent updates. - The `release` branch provides a production-ready version of the project at each tagged release.  - It is recommended to keep your fork of the repository updated with the latest changes from the `release` branch.

### Staying Updated

Whether you are contributing or using the project, staying updated is crucial:

* Regularly fetch and pull changes from the `main` branch to your local repository. This ensures that your work is based on the most recent codebase.
* If you are using the `release` branch, merge the latest changes from `main` into your fork periodically to keep it up-to-date with the latest releases.

By following these guidelines, both contributors and users can efficiently collaborate on and use the project, ensuring a smooth and productive development experience for everyone involved.

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

## Contributing

Please take the time to become familiar with our standards outlined below.
First and foremost please and comply with the standards outlined in the [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md).

### Committing Changes

 Please follow the following branch naming scheme when creating your branch: This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). [Commitizen](https://github.com/commitizen/cz-cli) can be used to help build commit messages. Or you can utilize the installed version with any of the following commands:

  ```sh
  yarn commit
  ```

#### _Note:_
 _To disable linting during the `pre-push` git hook (on your fork), you can either comment out the contents of the lefthook.yaml file or remove it, as well as uninstall lefthook from the package.json file._

 i.e

 ```sh
 $ rm lefthook.yaml
 $ yarn remove lefthook
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

## Releases

This repo uses [Semantic Release](https://github.com/semantic-release/semantic-release) for automated releases once per week. The release is triggered by a GitHub Action on the `main` branch. The release is based on the commit messages, so please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## Spec Customization

If you need to add or remove languages to the code snippet languages, you can pass in an object to `SpecDetails`.

You may pass in a `themeOverrides` object to `SpecDetails`. Here is an example if you would like to override languages:

```javascript
        <SpecDetails
          :theme-overrides="{
            languages: [
              {
                prismLanguage: 'bash',
                target: 'shell',
                client: 'curl'
              },
              {
                prismLanguage: 'javascript',
                target: 'javascript',
                client: 'xhr'
              },
              {
                prismLanguage: 'java',
                target: 'java'
              },
            ]
          }"
        />
```

The default languages are the following. They will be overridden by what you pass in to `SpecDetails`

```javascript
      languages = [
        {
          prismLanguage: 'bash',
          target: 'shell',
          client: 'curl'
        },
        {
          prismLanguage: 'javascript',
          target: 'javascript',
          client: 'xhr'
        },
        {
          prismLanguage: 'python',
          target: 'python'
        },
        {
          prismLanguage: 'ruby',
          target: 'ruby'
        }
      ]
```

## [Translations guidelines](./src/locales/README.md)

## Join the Community

* Join the Kong discussions at the Kong Nation forum: [https://discuss.konghq.com/](https://discuss.konghq.com/)
* Follow us on Twitter: [https://twitter.com/thekonginc](https://twitter.com/thekonginc)
* Check out the docs: [https://docs.konghq.com/](https://docs.konghq.com/)
* Keep updated on YouTube by subscribing: [https://www.youtube.com/c/KongInc/videos](https://www.youtube.com/c/KongInc/videos)
* Read up on the latest happenings at our blog: [https://konghq.com/blog/](https://konghq.com/blog/)
* Visit our homepage to learn more: [https://konghq.com/](https://konghq.com/)

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
