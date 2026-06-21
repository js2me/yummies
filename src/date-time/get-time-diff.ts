import { ms } from 'yummies/ms';
import { type RawDateToFormat, toLibFormat } from './_shared.js';

export type TimeDiff = {
  minutes: number;
  seconds: number;
  total: {
    ms: number;
    hours: number;
  };
};

/**
 * Calculates the difference between two dates in minutes, seconds and total units.
 *
 * @example
 * ```ts
 * getTimeDiff(new Date('2024-03-15T12:30:00'), new Date('2024-03-15T12:00:00'));
 * ```
 */
export const getTimeDiff = (
  dateA: RawDateToFormat,
  dateB: RawDateToFormat,
): TimeDiff => {
  const leftDate = toLibFormat(dateA)?.toDate();
  const rightDate = toLibFormat(dateB)?.toDate();

  if (!leftDate || !rightDate) {
    return {
      minutes: 0,
      seconds: 0,
      total: { ms: 0, hours: 0 },
    };
  }

  const msDiff = leftDate.getTime() - rightDate.getTime();

  return {
    minutes: Math.max(Math.floor(msDiff / ms(1, 'min')), 0),
    seconds: Math.max(Math.floor((msDiff % ms(1, 'min')) / 1000), 0),
    total: {
      hours: Math.round(msDiff / ms(1, 'hour')),
      ms: msDiff,
    },
  };
};
