# use-key-down

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

React hook for listening to custom `keydown` [events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

## Introduction

This hook optimizes the use of keyboard events by only creating a single window `keydown` event listener for all instances of the hook, avoiding the creation of unnecessary listeners and increasing efficiency.

This library is also SSR safe, and only runs on the client.

## Installation

Install this package with `npm`.

```bash
npm i @buildinams/use-key-down
```

## Usage

To listen to a single key:

```tsx
import useKeyDown from "@buildinams/use-key-down";

useKeyDown("Escape", () => {}); // Do something on "Escape"...
```

To listen to key modifiers:

```tsx
import useKeyDown from "@buildinams/use-key-down";

useKeyDown("g", (event: KeyboardEvent) => {
  if (event.ctrlKey) // Do something on "Ctrl + G"...
});
```

## Requirements

This library requires a minimum React version of `18.0.0`.

## Requests and Contributing

Found an issue? Want a new feature? Get involved! Please contribute using our guideline [here](https://github.com/buildinamsterdam/use-key-down/blob/main/CONTRIBUTING.md).

[npm-image]: https://img.shields.io/npm/v/@buildinams/use-key-down.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@buildinams/use-key-down
[ci-image]: https://github.com/buildinamsterdam/use-key-down/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/buildinamsterdam/use-key-down/actions
[npm-downloads-image]: https://img.shields.io/npm/dm/@buildinams/use-key-down.svg
[npm-downloads-url]: https://npmcharts.com/compare/@buildinams/use-key-down?minimal=true
