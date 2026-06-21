import { declension } from 'yummies/text';
import { dayjs } from './_shared.js';
import { dayTimeDuration } from './day-time-duration.js';

const durationFormatLabels = {
  days: { compact: 'д', full: ['день', 'дня', 'дней'] },
  hours: { compact: 'ч', full: ['час', 'часа', 'часов'] },
  minutes: { compact: 'мин', full: ['минута', 'минуты', 'минут'] },
  seconds: { compact: 'сек', full: ['секунда', 'секунды', 'секунд'] },
} as const;

/**
 * Formats a duration either from milliseconds or between two dates.
 *
 * @example
 * ```ts
 * getFormatDuration(ms(2, 'hour') + ms(15, 'min'));
 * ```
 */
export function getFormatDuration(
  dateA: Date,
  dateB: Date,
  compact?: boolean,
): string;
export function getFormatDuration(ms: number, compact?: boolean): string;

export function getFormatDuration(...args: any[]): string {
  let compact = false;
  let diff = 0;

  if (args[0] instanceof Date) {
    const startedDate = dayjs(args[0]);
    const endedDate = dayjs(args[1]);

    diff = endedDate.diff(startedDate, 'ms');
    compact = args[2] === true;
  } else {
    diff = args[0];
    compact = args[1] === true;
  }

  const { days, hours, minutes, seconds } = dayTimeDuration(diff);

  const formattedParts: string[] = [];

  if (days) {
    if (compact) {
      formattedParts.push(`${days} ${durationFormatLabels.days.compact}`);
    } else {
      formattedParts.push(
        `${days} ${declension(days, durationFormatLabels.days.full)}`,
      );
    }
  }

  if (hours) {
    if (compact) {
      formattedParts.push(`${hours} ${durationFormatLabels.hours.compact}`);
    } else {
      formattedParts.push(
        `${hours} ${declension(hours, durationFormatLabels.hours.full)}`,
      );
    }
  }

  if (minutes) {
    if (compact) {
      formattedParts.push(`${minutes} ${durationFormatLabels.minutes.compact}`);
    } else {
      formattedParts.push(
        `${minutes} ${declension(minutes, durationFormatLabels.minutes.full)}`,
      );
    }
  }

  if (seconds) {
    if (compact) {
      formattedParts.push(`${seconds} ${durationFormatLabels.seconds.compact}`);
    } else {
      formattedParts.push(
        `${seconds} ${declension(seconds, durationFormatLabels.seconds.full)}`,
      );
    }
  }

  return formattedParts.join(' ');
}
