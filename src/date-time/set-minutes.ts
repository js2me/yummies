import { type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Returns a new date with the minutes field replaced.
 *
 * @example
 * ```ts
 * setMinutes(new Date('2024-03-15T12:00:00'), 45);
 * ```
 */
export const setMinutes = (date: RawDateToFormat, minutes: number) =>
  toLibFormat(date)?.set('m', minutes).toDate();
