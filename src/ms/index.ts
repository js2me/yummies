/**
 * ---header-docs-section---
 * # yummies/ms
 *
 * ## Description
 *
 * Converts human-friendly time units (seconds, minutes, hours, days, weeks) to **milliseconds** for
 * timers, animations, and `dayjs`-style math. The `unitsToMs` map is shared across the library so
 * delays and durations stay consistent instead of scattering `* 1000` literals through the code.
 *
 * ## Usage
 *
 * ```ts
 * import { ms } from "yummies/ms";
 * ```
 */

export * from './ms.js';
export * from './units-to-ms.js';
