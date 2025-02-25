import { describe, expect, test } from 'vitest';

import {
  changeDate,
  dayTimeDuration,
  timeDuration,
  getFormatDuration,
} from './date-time';
import { unitsToMs } from './ms';

describe('date-time', () => {
  describe('dayTimeDuration', () => {
    test('-1 minute', () => {
      expect(dayTimeDuration(-unitsToMs.min)).toStrictEqual({
        days: 0,
        hours: 0,
        seconds: 0,
        minutes: 0,
        milliseconds: 0,
      });
    });

    test('1 minute', () => {
      expect(dayTimeDuration(unitsToMs.min)).toStrictEqual({
        days: 0,
        hours: 0,
        seconds: 0,
        minutes: 1,
        milliseconds: 0,
      });
    });

    test('30 minutes 45 seconds', () => {
      expect(
        dayTimeDuration(unitsToMs.min * 30 + unitsToMs.sec * 45),
      ).toStrictEqual({
        days: 0,
        hours: 0,
        seconds: 45,
        minutes: 30,
        milliseconds: 0,
      });
    });

    test('34 days 59 minutes 59 seconds', () => {
      expect(
        dayTimeDuration(
          34 * unitsToMs.day + unitsToMs.min * 59 + unitsToMs.sec * 59,
        ),
      ).toStrictEqual({
        days: 34,
        hours: 0,
        minutes: 59,
        seconds: 59,
        milliseconds: 0,
      });
    });
  });
  describe('timeDuration', () => {
    test('-1 minute', () => {
      expect(timeDuration(-unitsToMs.min)).toStrictEqual({
        hours: 0,
        seconds: 0,
        minutes: 0,
        milliseconds: 0,
      });
    });

    test('1 minute', () => {
      expect(timeDuration(unitsToMs.min)).toStrictEqual({
        hours: 0,
        seconds: 0,
        minutes: 1,
        milliseconds: 0,
      });
    });

    test('30 minutes 45 seconds', () => {
      expect(
        timeDuration(unitsToMs.min * 30 + unitsToMs.sec * 45),
      ).toStrictEqual({
        hours: 0,
        seconds: 45,
        minutes: 30,
        milliseconds: 0,
      });
    });

    test('34 days 59 minutes 59 seconds', () => {
      expect(
        timeDuration(
          34 * unitsToMs.day + unitsToMs.min * 59 + unitsToMs.sec * 59,
        ),
      ).toStrictEqual({
        hours: 2_937_600_000,
        minutes: 59,
        seconds: 59,
        milliseconds: 0,
      });
    });
  });
  describe('getFormatDuration', () => {
    test('30 minutes', () => {
      const dateA = new Date(`2025-02-10T09:53:00.000Z`);
      const dateB = changeDate(dateA, 30, 'minutes');
      expect(getFormatDuration(dateA, dateB)).toBe('30 минут');
    });
    test('2 hours 45 minutes 10 seconds', () => {
      const dateA = new Date(`2025-02-10T09:53:00.000Z`);
      const dateB = changeDate(dateA, 2, 'hours', 45, 'minutes', 10, 'seconds');
      expect(getFormatDuration(dateA, dateB)).toBe('2 часа 45 минут 10 секунд');
    });
    test('2 hours 45 minutes 10 seconds (compact)', () => {
      const dateA = new Date(`2025-02-10T09:53:00.000Z`);
      const dateB = changeDate(dateA, 2, 'hours', 45, 'minutes', 10, 'seconds');
      expect(getFormatDuration(dateA, dateB, true)).toBe('2 ч 45 мин 10 сек');
    });
  });
});
