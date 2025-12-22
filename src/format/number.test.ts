import { describe, expect, test } from 'vitest';

import { number } from './number';

describe('format.number', () => {
  test('[BUG] Infinite formatting of the number 23162 with an empty delimiter', () => {
    expect(number(23_162, { digits: 4, cutZeros: true, delimiter: '' })).toBe(
      '23162',
    );
  });
  test('Formatting the number 23162', () => {
    expect(number(23_162, { digits: 4, cutZeros: true, delimiter: '_' })).toBe(
      '23_162',
    );
  });
  test('cropDigitsOnly: true', () => {
    expect(number(7.99999962002039, { digits: 2, cropDigitsOnly: true })).toBe(
      '7.99',
    );
  });
});
