/**
 * ---header-docs-section---
 * # yummies/data
 *
 * ## Description
 *
 * General-purpose data helpers: shallow equality, normalizing values to arrays, and recursive
 * `flatMap`-style transforms. They complement `Array`/`Object` builtins when you need stable
 * comparisons for memoization or small structural utilities without pulling a large lodash-style
 * dependency into the bundle.
 *
 * ## Usage
 *
 * ```ts
 * import { isShallowEqual, toArray } from "yummies/data";
 * ```
 */

export * from './flat-map-deep.js';
export * from './has-enumerable-keys.js';
export * from './is-shallow-equal.js';
export * from './is-unsafe-property.js';
export * from './safe-json-parse.js';
export * from './to-array.js';
