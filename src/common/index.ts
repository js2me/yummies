/**
 * ---header-docs-section---
 * # yummies/common
 *
 * ## Description
 *
 * Small helpers for values that may be either plain data or callables (`MaybeFn` pattern). Use them
 * when a prop or config can be a static value or a factory, without forcing callers to branch on
 * `typeof` everywhere. The module also keeps a thin compatibility layer for older `FnValue` naming.
 * Everything is typed to preserve argument tuples and return types through `callFunction`.
 *
 * ## Usage
 *
 * ```ts
 * import { callFunction } from "yummies/common";
 * ```
 */

export * from './call-function.js';
export * from './fn-value.js';
export * from './resolve-fn-value.js';
