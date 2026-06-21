import { unitsToMs } from 'yummies/ms';
import { dayTimeDuration } from './day-time-duration.js';

/**
 * Converts milliseconds into hour-based time parts without keeping full days separately.
 *
 * @example
 * ```ts
 * timeDuration(ms(1, 'hour') + ms(30, 'min'));
 * ```
 */
export const timeDuration = (timeInMs: number) => {
  const { days, hours, milliseconds, minutes, seconds } =
    dayTimeDuration(timeInMs);

  return {
    hours: hours + unitsToMs.day * days,
    milliseconds,
    minutes,
    seconds,
  };
};
