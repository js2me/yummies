/**
 * ---header-docs-section---
 * # yummies/format
 *
 * ## Description
 *
 * Namespace-style **number, percent, and string** formatting for UI tables, inputs, and charts.
 * Submodules cover locale-aware numbers, percent parsing/formatting, trimming helpers, and shared
 * constants so presentation rules stay centralized and tree-shakable behind the package
 * aggregated **format** export from this entry point.
 *
 * ## Usage
 *
 * ```ts
 * import { format } from "yummies/format";
 * ```
 */

export * from './constants.js';
export * from './number.js';
export * from './percent.js';
export * from './skip-spaces.js';
