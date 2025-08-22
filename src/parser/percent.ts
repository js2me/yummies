import type { Maybe } from '../utils/types.js';

import { type NumberParserSettings, number } from './number.js';

export const percent = <TFallback = number>(
  value: Maybe<string | number>,
  maxValue?: Maybe<string | number>,
  settings?: Maybe<NumberParserSettings<TFallback>>,
) => {
  return number<TFallback>((Number(value) / Number(maxValue)) * 100, settings);
};
