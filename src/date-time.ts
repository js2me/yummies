import dayjs, { type Dayjs, type ManipulateType } from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { format } from 'yummies/format';
import { ms, unitsToMs } from 'yummies/ms';
import { declension } from 'yummies/text';
import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/types';

import 'dayjs/locale/ru.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale('ru');

const toLibFormat = (value: Maybe<RawDateToFormat>): Dayjs | null => {
  let result: Maybe<Dayjs> = null;
  if (dayjs.isDayjs(value)) {
    result = value;
  } else if (value != null) {
    result = dayjs(value);
  }

  if (!result?.isValid()) {
    return null;
  }

  return result;
};

export type RawDateToFormat = Date | string | number | Dayjs;

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

type DateChangeParam = [amount: number, unit?: Maybe<ManipulateType>];

export const changeDate = (
  date: Maybe<RawDateToFormat>,
  ...args: [
    ...DateChangeParam,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
  ]
) => {
  let wrappedDate = toLibFormat(date)!;

  for (let i = 0; i < args.length; i += 2) {
    const amount = args[i] as DateChangeParam[0];
    const unit = args[i + 1] as DateChangeParam[1];
    if (unit != null) {
      wrappedDate = wrappedDate.add(amount, unit);
    }
  }

  return wrappedDate.toDate();
};

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

const durationFormatLabels = {
  days: { compact: 'д', full: ['день', 'дня', 'дней'] },
  hours: { compact: 'ч', full: ['час', 'часа', 'часов'] },
  minutes: { compact: 'мин', full: ['минута', 'минуты', 'минут'] },
  seconds: { compact: 'сек', full: ['секунда', 'секунды', 'секунд'] },
} as const;

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

export type TimeDiff = {
  minutes: number;
  seconds: number;
  total: {
    ms: number;
    hours: number;
  };
};
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

export const addDays = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.add(count, 'd').toDate();

export const subtractDays = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.subtract(count, 'd').toDate();

export const addMinutes = (date: RawDateToFormat, count: number) =>
  toLibFormat(date)?.add(count, 'm').toDate();

export const setMinutes = (date: RawDateToFormat, minutes: number) =>
  toLibFormat(date)?.set('m', minutes).toDate();

export const setHours = (date: RawDateToFormat, hours: number) =>
  toLibFormat(date)?.set('h', hours).toDate();
