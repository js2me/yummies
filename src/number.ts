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

/**
 * Works like `parseFloat(number.toFixed(4))` but performance better
 *
 * @example
 * round(191.212999999999999999999999, 4) // 191.213
 */
export function round(value: number, decimalPlaces: number = 0): number {
  if (!decimalPlaces) {
    return Math.round(value);
  }

  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}
