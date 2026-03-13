import type { Maybe } from 'yummies/types';

import { type NumberParserSettings, number } from './number.js';

/**
 * Converts a value into a percentage of `maxValue` and parses the result with
 * the shared numeric parser.
 *
 * @template TFallback Fallback value type returned when parsing fails.
 * @param value Current value.
 * @param maxValue Maximum value representing `100%`.
 * @param settings Numeric parser settings for the computed percentage.
 * @returns Parsed percentage or fallback value.
 *
 * @example
 * ```ts
 * percent(25, 200); // 12.5
 * ```
 *
 * @example
 * ```ts
 * percent('bad', 100, { fallback: 0 }); // 0
 * ```
 */
export const percent = <TFallback = number>(
  value: Maybe<string | number>,
  maxValue?: Maybe<string | number>,
  settings?: Maybe<NumberParserSettings<TFallback>>,
) => {
  return number<TFallback>((Number(value) / Number(maxValue)) * 100, settings);
};
