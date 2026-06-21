import { unitsToMs } from 'yummies/ms';

/**
 * Splits a duration in milliseconds into day-based time parts.
 *
 * @example
 * ```ts
 * dayTimeDuration(ms(1, 'day') + ms(2, 'hour'));
 * ```
 */
export const dayTimeDuration = (timeInMs: number) => {
  let left = Math.max(timeInMs, 0);

  const days = Math.floor(left / unitsToMs.day);
  left = left % unitsToMs.day;

  const hours = Math.floor(left / unitsToMs.hour);
  left = left % unitsToMs.hour;

  const minutes = Math.floor(left / unitsToMs.min);
  left = left % unitsToMs.min;

  const seconds = Math.floor(left / unitsToMs.sec);
  left = left % unitsToMs.sec;

  const milliseconds = Math.floor(left);

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};
