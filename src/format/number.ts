import { number as toNumber } from '../parser/number.js';
import { typeGuard } from '../type-guard/index.js';
import type { Maybe } from '../utils/types.js';

import { NO_VALUE } from './constants.js';

export interface NumberFormatSettings {
  delimiter?: string;
  /**
   * digitsOnlyForFloat - Show digits after decimal point only if they are not zeros after converting to number.
   * Example: "0.00" -> "0", "0.10" -> "0.1", but "0.003" -> "0.003"
   *
   * @default true
   */
  digitsOnlyForFloat?: boolean;
  /**
   * Text which will be returned if the value is undefined, null, NaN, Infinity or empty string.
   * Example: "–" will be returned if the value is undefined and emptyText is "–".
   */
  emptyText?: string;
  /**
   * Text to append to the end of the formatted number.
   * Example: if value is 1000 and postfix is "₽", result will be "1 000₽".
   */
  postfix?: string;
  /**
   * Fixed number of digits after the decimal point (number.toFixed() method)
   * If set to false, the truncation is ignored!
   */
  digits?: number | false;
  /**
   * Remove trailing zeros from the end of the number
   * Example: 0.010000000000000000000000000000000000000000000 -> 0.01
   */
  cutZeros?: boolean;
}

export const number = (
  rawValue: Maybe<string | number>,
  userSettings?: Maybe<NumberFormatSettings>,
): string => {
  const settings = {
    ...number.defaultSettings,
    ...userSettings,
  };

  const digits = settings.digits ?? 0;
  const cutZeros = settings?.cutZeros ?? false;
  const delimiter = settings.delimiter ?? ' ';
  const postfix = settings.postfix ?? '';
  const emptyText = settings.emptyText ?? NO_VALUE;
  const digitsOnlyForFloat = settings.digitsOnlyForFloat ?? true;

  let value: Maybe<number>;

  if (typeGuard.isString(rawValue)) {
    value = toNumber(value, { fallback: undefined });
  } else {
    value = rawValue;
  }

  if (typeGuard.isNumber(value)) {
    let raw: string = `${value}`;

    if (digits !== false) {
      raw = value.toFixed(digits);
    }
    if (cutZeros) {
      raw = `${+raw}`;
    }

    const [integerPart, decimalPart] = raw.split('.', 2);

    let formattedIntegerPart = integerPart;
    let formattedDecimalPart = '';

    if (decimalPart && (!digitsOnlyForFloat || !/^0+$/.test(decimalPart))) {
      formattedDecimalPart = `.${decimalPart}`;
    }

    const rgx = /(\d+)(\d{3})/;

    while (rgx.test(formattedIntegerPart) && delimiter) {
      formattedIntegerPart = formattedIntegerPart.replace(
        rgx,
        `$1${delimiter}$2`,
      );
    }

    return formattedIntegerPart + formattedDecimalPart + postfix;
  }

  return emptyText;
};

number.defaultSettings = {} as NumberFormatSettings;
