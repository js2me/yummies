import { type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Returns a new date shifted forward by the provided number of days.
 *
 * @example
 * ```ts
 * addDays(new Date('2024-03-15'), 7);
 * ```
 */
export const addDays = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.add(count, 'd').toDate();
