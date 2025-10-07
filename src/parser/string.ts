import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/utils/types';

export interface StringParserSettings<TFallback = string> {
  fallback?: TFallback;
  prettyJson?: boolean;
}

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
