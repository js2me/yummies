/**
 * ---header-docs-section---
 * # yummies/parser
 *
 * ## Description
 *
 * Parsers for user-entered **numbers, percents, and strings** with tolerant input and typed
 * results. Use when normalizing form values, query params, or CSV-like text before validation
 * schemas run, without duplicating regex and `parseFloat` edge cases in every feature module.
 *
 * ## Usage
 *
 * ```ts
 * import { parser } from "yummies/parser";
 * ```
 */

export * from './number.js';
export * from './percent.js';
export * from './string.js';
