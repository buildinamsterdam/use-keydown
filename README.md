# use-key

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

A react hook for listening to custom [KeyboardEvents](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

## Introduction

This hook optimizes the use of keyboard events by only creating a single window `keydown` and `keyup` listener for all instances of the hook, avoiding the creation of unnecessary listeners and increasing efficiency.

This library is also SSR safe, and only runs on the client.

## Installation

Install this package with `npm`.

```bash
npm i @buildinams/use-key
```

## Usage

To listen to a single key:

```tsx
import useKey from "@buildinams/use-key";

useKey("Escape", (pressed: boolean) => {
  if (pressed) // Do something on "Escape"...
});
```

To listen to key modifiers:

```tsx
import useKey from "@buildinams/use-key";

useKey("g", (pressed: boolean, event: KeyboardEvent) => {
  if (pressed && event.ctrlKey) // Do something on "Ctrl + G"...
});
```

## Requirements

This library requires a minimum React version of `18.0.0`.

## Requests and Contributing

Found an issue? Want a new feature? Get involved! Please contribute using our guideline [here](https://github.com/buildinamsterdam/use-key/blob/main/CONTRIBUTING.md).

[npm-image]: https://img.shields.io/npm/v/@buildinams/use-key.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@buildinams/use-key
[ci-image]: https://github.com/buildinamsterdam/use-key/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/buildinamsterdam/use-key/actions
[npm-downloads-image]: https://img.shields.io/npm/dm/@buildinams/use-key.svg
[npm-downloads-url]: https://npmcharts.com/compare/@buildinams/use-key?minimal=true
