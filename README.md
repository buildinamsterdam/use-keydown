# use-keydown

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

React hook for listening to custom `keydown` [events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

## Introduction

This hook optimizes keyboard event handling by utilizing a single window `keydown` event listener for all instances of the hook, resulting in a more streamlined and efficient process.

This library is also SSR safe, and only runs on the client.

## Installation

Install this package with `npm`.

```bash
npm i @buildinams/use-keydown
```

## Usage

To listen to a single key:

```tsx
import useKeydown from "@buildinams/use-keydown";

useKeydown("Escape", () => {}); // Do something on "Escape"...
```

To listen to key modifiers:

```tsx
import useKeydown from "@buildinams/use-keydown";

useKeydown("KeyG", (event: KeyboardEvent) => {
  if (event.ctrlKey) // Do something on "Ctrl + G"...
});
```

## Requirements

This library requires a minimum React version of `18.0.0`.

## Requests and Contributing

Found an issue? Want a new feature? Get involved! Please contribute using our guideline [here](https://github.com/buildinamsterdam/use-keydown/blob/main/CONTRIBUTING.md).

[npm-image]: https://img.shields.io/npm/v/@buildinams/use-keydown.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@buildinams/use-keydown
[ci-image]: https://github.com/buildinamsterdam/use-keydown/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/buildinamsterdam/use-keydown/actions
[npm-downloads-image]: https://img.shields.io/npm/dm/@buildinams/use-keydown.svg
[npm-downloads-url]: https://npmcharts.com/compare/@buildinams/use-keydown?minimal=true
