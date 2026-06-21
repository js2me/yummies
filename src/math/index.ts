/**
 * ---header-docs-section---
 * # yummies/math
 *
 * ## Description
 *
 * Tiny math helpers: degree/radian conversion and nullable-safe percentage calculations. They wrap
 * common formulas so components do not repeat magic numbers or null checks when deriving layout or
 * charts from partially loaded data.
 *
 * ## Usage
 *
 * ```ts
 * import { degToRad, percentFrom } from "yummies/math";
 * ```
 */

export * from './deg-to-rad.js';
export * from './percent-from.js';
export * from './rad-to-deg.js';
