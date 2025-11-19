import { describe, expect, test } from 'vitest';
import { number } from './number';

describe('parser.number', () => {
  test('empty string should return 0', () => {
    expect(number('')).toBe(0);
  });

  test('empty string with fallback should return fallback', () => {
    expect(number('', { fallback: 'kek' })).toBe('kek');
  });

  test('Checking the logic of the function', () => {
    expect(number(1)).toBe(1);
    expect(number(100)).toBe(100);
    expect(number(500)).toBe(500);
    expect(number(1, { clamped: [400] })).toBe(400);
    expect(number(1001, { clamped: [null, 1000] })).toBe(1000);
  });

  test('Rounding down', () => {
    expect(number(5.9, { floor: true })).toBe(5);
  });

  test('Rounding up', () => {
    expect(number(5.1, { ceil: true })).toBe(6);
  });

  test('Processing invalid values', () => {
    expect(number(null)).toBe(0);
    expect(number(undefined)).toBe(0);
    expect(number('-')).toBe(0);
    expect(number('test')).toBe(0);

    expect(number(null, null)).toBe(0);
    expect(number(undefined, undefined)).toBe(0);
  });

  test('fallback with empty string', () => {
    expect(number('', { fallback: null })).toBe(null);
  });
});
