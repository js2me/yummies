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
 * Formats a value as a percent string with configurable decimal precision,
 * decimal divider and suffix symbol.
 *
 * @param value Number or numeric string to format.
 * @param settings Parser and formatting options.
 * @returns Formatted percent string or fallback text for invalid values.
 *
 * @example
 * ```ts
 * percent(12.345); // '12.35%'
 * ```
 *
 * @example
 * ```ts
 * percent(12.345, { divider: ',', symbol: ' pct' }); // '12,35 pct'
 * ```
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
