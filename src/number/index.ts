/**
 * ---header-docs-section---
 * # yummies/number
 *
 * ## Description
 *
 * Numeric rounding that avoids classic floating-point artifacts (`191.212999…`) without paying for
 * string round-trips in hot paths. Use when formatting prices, charts, or sliders where a fixed
 * decimal count must be stable for display and comparisons.
 *
 * ## Usage
 *
 * ```ts
 * import { round } from "yummies/number";
 * ```
 */

export * from './round.js';
