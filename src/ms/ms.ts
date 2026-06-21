import { unitsToMs } from './units-to-ms.js';

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
