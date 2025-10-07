import { format } from 'yummies/format';
import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/utils/types';

export interface NumberParserSettings<TFallback = number> {
  digits?: number;
  fallback?: TFallback;
  /**
   * Round to upper boundary
   * 5.1 -> 6
   */
  ceil?: boolean;
  /**
   * Round to bottom boundary
   * 5.9 -> 5
   */
  floor?: boolean;
  clamped?: [min?: Maybe<number>, max?: Maybe<number>];
}

export const number = <TFallback = number>(
  input: Maybe<unknown>,
  userSettings?: Maybe<NumberParserSettings<TFallback>>,
): number | TFallback => {
  const settings = {
    ...number.defaultSettings,
    ...userSettings,
  };

  const fallback = settings?.fallback ?? 0;

  let result: number;

  if (typeGuard.isNumber(input)) {
    result = input;
  } else if (typeGuard.isString(input)) {
    const formattedInput = format.skipSpaces(input).replace(',', '.');
    if (formattedInput === '') {
      result = fallback as any;
    } else {
      result = Number(formattedInput);
    }
  } else {
    result = fallback as any;
  }

  if (typeGuard.isNumber(result)) {
    if (settings?.clamped != null) {
      result = Math.max(
        settings.clamped[0] ?? -Infinity,
        Math.min(result, settings.clamped[1] ?? Infinity),
      );
    }

    if (settings?.ceil != null) {
      result = Math.ceil(result);
    }

    if (settings?.floor != null) {
      result = Math.floor(result);
    }

    if (settings?.digits != null) {
      result = +result.toFixed(settings.digits);
    }

    return result;
  } else {
    return fallback;
  }
};

number.defaultSettings = {} as NumberParserSettings;
