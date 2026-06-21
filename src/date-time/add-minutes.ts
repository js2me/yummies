import { type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Returns a new date shifted forward by the provided number of minutes.
 *
 * @example
 * ```ts
 * addMinutes(new Date('2024-03-15T12:00:00'), 15);
 * ```
 */
export const addMinutes = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.add(count, 'm').toDate();
