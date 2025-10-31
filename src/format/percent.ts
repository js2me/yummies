import { parser } from 'yummies/parser';
import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/types';

import { NO_VALUE } from './constants.js';

export interface PercentFormatSettings
  extends Omit<parser.NumberParserSettings, 'fallback'> {
  divider?: string;
  delimiter?: string;
  symbol?: string;
  emptyText?: string;
}

/**
 * 100 -> 100%
 * 99.123214412 -> 99.12%
 * 99.123214412 -> 99,12%
 */
export const percent = (
  value: Maybe<number | string>,
  settings?: PercentFormatSettings,
) => {
  const numericValue = parser.number(value, {
    ...settings,
    digits: settings?.digits ?? 2,
    fallback: Number.NaN,
  });

  if (typeGuard.isNumber(numericValue)) {
    const divider = settings?.divider ?? '.';

    const formattedPercent =
      divider === '.' ? numericValue : `${numericValue}`.replace('.', divider);

    return `${formattedPercent}${settings?.delimiter ?? ''}${settings?.symbol ?? '%'}`;
  } else {
    return settings?.emptyText ?? NO_VALUE;
  }
};
