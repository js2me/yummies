import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/types';

export interface StringParserSettings<TFallback = string> {
  fallback?: TFallback;
  prettyJson?: boolean;
}

/**
 * Converts arbitrary input into a string representation.
 *
 * Objects are serialized with `JSON.stringify`, optionally pretty-printed, and
 * nullish values resolve to the configured fallback.
 *
 * @template TFallback Fallback value type returned for nullish input.
 * @param input Raw value to stringify.
 * @param settings String conversion settings.
 * @returns Stringified input or fallback value.
 *
 * @example
 * ```ts
 * string(123); // '123'
 * ```
 *
 * @example
 * ```ts
 * string({ id: 1 }, { prettyJson: true });
 * ```
 */
export const string = <TFallback = string>(
  input: Maybe<unknown>,
  settings?: Maybe<StringParserSettings<TFallback>>,
): string | TFallback => {
  const fallback =
    settings && 'fallback' in settings ? (settings.fallback as TFallback) : '';

  if (input == null) {
    return fallback;
  }

  if (typeGuard.isObject(input)) {
    if (settings?.prettyJson) {
      return JSON.stringify(input, null, 2);
    }

    return JSON.stringify(input);
  }

  return String(input);
};
