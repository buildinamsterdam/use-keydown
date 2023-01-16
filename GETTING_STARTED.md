# Setup

This document outlines the steps to get started when creating a new package.

**Important**: This document serves as a guide for setting up a new package and is intended for internal use only. Once the package is set up, it should be deleted from the repo. For instructions on how to use the package, refer to and update the **README.md** file, which is publicly available. This documentation is intended to assist with initial setup and should not be included in the final, published library.

## Getting started

Clone the repository. Then normalize Node / NPM version (if you haven't got NVM installed, follow instructions [here](https://github.com/nvm-sh/nvm)):

```bash
nvm use
```

Install dependencies:

```bash
npm ci
```

## Creating a new package

When getting started you'll want to globally find and replace the following:

- `PACKAGE-NAME` - The name of the package, e.g. `use-hook`.
- `PACKAGE-DESCRIPTION` - A short one-liner description of the package.

Then, update the list of `keywords` inside `package.json` with relevant keywords. These should match those defined as package `Topics` on GitHub.

## Testing

To run tests locally, run:

```bash
npm run test
```

To watch for changes while developing the tests, run:

```bash
npm run test:watch
```

To get a coverage report, run:

```bash
npm run test:coverage
```

## Trying out the package locally before publishing

To try out the package locally, we can use [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) to install the package onto a local project. It's a super easy way to test out any package before publishing in a real project.

First build the package, run:

```bash
npm run build
```

To link, run:

```bash
npm link
```

Then in the project you want to test it in, run:

```bash
npm link @buildinams/PACKAGE-NAME
```

Once done testing, you can unlink the package by running:

```bash
npm unlink --no-save @buildinams/PACKAGE-NAME
```

Couple things to **Note**:

- When running `npm link` the package-name is taken from `package.json` and <u>not</u> from the directory name. So in our case it'll always be prefixed with `@buildinams/` and then the name of the package, such as `@buildinams/use-hook`.
- Link is based on the built package, so every time you make a change to the package, you'll need to rebuild it. But you don't need to re-link it.
- If you're having issues linking, you may need to do a clean package install in both the package and the project you're testing it in. To do this; delete `node_modules` and run `npm i` in both then try linking again.
- You can confirm link worked by checking if the linked package is found in the `node_modules` directory of the project you're testing it in. It'll be inside a module called `@buildinams` and then the name of the package.

## Linting

To lint the package, run:

```bash
npm run lint
```

To lint the package and fix any issues, run:

```bash
npm run lint:fix
```

## What to do next

This template is designed to be a starting point for a package. You can change anything you want, but there are a few things you should keep in mind:

- Versioning is based on [Semantic Versioning](https://semver.org/). It's super important to follow this, as it makes it clear to users what changes they can expect when upgrading.
- Feel free to add new linting rules, testing frameworks, remove packages you don't need, etc. This template is a starting point and a demo for React hooks, but of course you can use it for other things too.
- A good `README.md` is super important. It's the first thing people will see when they come to our package, so make sure it's clear and easy to understand. Don't leave anything up to the imagination, make it as easy as possible for people to use your package.
- Only what you export inside `index.ts` will be available to users of your package. So make sure to export everything a user might need. Especially any types. If you don't export something, it won't be available via import.
- Inside `package.json` you'll see `peerDependencies` and the more common `devDependencies`. Peer dependencies are the libraries this package requires to work. By default the only requirement is React 18+, everything else inside dev dependencies is just used for development and won't be installed when people use this library. If you add a package that is required for the package to work, it should be a peer dependency. If you add a package that is only used for development, it should be a dev dependency.
- When setting up new packages it can sometimes be difficult to get started. If you're having trouble, look at other packages for inspiration. NPM has many other great libraries, so it's a great place for inspiration.

## Publishing

To publish the package, you'll first have to generate an NPM secret. This is the secret that is used to authenticate with NPM when publishing. It's a one-time thing, so you'll only need to do it once.

Steps to generate token:

1. Go to [NPM](https://www.npmjs.com/) and log in. **Note**: You'll need to be added to the `@buildinams` organization on NPM to be able to publish packages.
2. Then go to Access Tokens in your profile.
3. Click `Generate New Token` then `Classic Token`.
4. Give it a name if you want (it's optional), select `Automation` option and click `Generate Token`.
5. Copy the token and save it somewhere safe. You'll only be able to see it once.

Steps to publish:

1. Go to the projects settings on Github at [GitHub](https://github.com/buildinamsterdam/PACKAGE-NAME/settings).
2. Under `Secrets` open `Secrets and variables`, then go to `Actions` (or go directly [here](https://github.com/buildinamsterdam/PACKAGE-NAME/settings/secrets/actions)).
3. Click `New repository secret` and set the title as `NPM_TOKEN` and the value as the token you generated in the previous steps.

Now you're ready to publish! To publish you can simply go to [releases](https://github.com/buildinamsterdam/PACKAGE-NAME/releases/new) and create a new release. The release will then be automatically published to NPM once `publish-npm.yml` actions pass.
