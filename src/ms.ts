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

export const unitsToMs = {
  ms: 1,
  sec: 1000,
  min: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
} as const;

/**
 * Converts a value in the specified unit to milliseconds.
 *
 * @example
 * ```ts
 * ms(1, 'min') // 60_000
 * ms(30, 'sec') // 30_000
 * ```
 */
export const ms = (value: number, unit: keyof typeof unitsToMs = 'ms') =>
  value * unitsToMs[unit];
