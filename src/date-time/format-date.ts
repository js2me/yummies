import type duration from 'dayjs/esm/plugin/duration/index.js';
import { format } from 'yummies/format';
import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/types';
import { dayjs, type RawDateToFormat, toLibFormat } from './_shared.js';

/**
 * Formats a date-like value using predefined presets or a custom pattern.
 *
 * @example
 * ```ts
 * formatDate('2024-03-15', { format: 'time-short' });
 * ```
 */
export const formatDate = (
  value: Maybe<RawDateToFormat>,
  settings?: Maybe<{
    format?:
      | 'human'
      | 'full'
      | 'short'
      | 'day'
      | 'day-only'
      | 'date'
      | 'month'
      | 'spent-time'
      | 'time'
      | 'time-short';
    pattern?: string;
    asTime?: boolean;
  }>,
) => {
  const dateFormat = settings?.format;
  const datePattern = settings?.pattern;
  const asTime = settings?.asTime;

  let libDate: duration.Duration | dayjs.Dayjs | null = null;

  if (asTime && typeGuard.isNumber(value)) {
    libDate = dayjs.duration(value);
  } else {
    libDate = toLibFormat(value);
  }

  if (!libDate) {
    return format.NO_VALUE;
  }

  if (datePattern) {
    return libDate.format(datePattern);
  }

  if (dateFormat === 'human' || dateFormat === 'spent-time') {
    if ('fromNow' in libDate) {
      return libDate.fromNow(dateFormat === 'spent-time');
    } else {
      return format.NO_VALUE;
    }
  }

  switch (dateFormat) {
    case 'full': {
      return libDate.format('DD MMM YYYY HH:mm:ss');
    }
    case 'short': {
      return libDate.format('DD MMM HH:mm');
    }
    case 'time': {
      return libDate.format('HH:mm:ss');
    }
    case 'time-short': {
      return libDate.format('HH:mm');
    }
    case 'day': {
      return libDate.format('DD MMM YYYY');
    }
    case 'month': {
      return libDate.format('MMMM YYYY');
    }
    default: {
      return libDate.format('DD.MM.YYYY');
    }
  }
};
