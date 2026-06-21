import { type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Returns a new date shifted backward by the provided number of days.
 *
 * @example
 * ```ts
 * subtractDays(new Date('2024-03-15'), 7);
 * ```
 */
export const subtractDays = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.subtract(count, 'd').toDate();
