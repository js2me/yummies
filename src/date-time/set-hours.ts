import { type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Returns a new date with the hours field replaced.
 *
 * @example
 * ```ts
 * setHours(new Date('2024-03-15T12:00:00'), 9);
 * ```
 */
export const setHours = (date: RawDateToFormat, hours: number) =>
  toLibFormat(date)?.set('h', hours).toDate();
