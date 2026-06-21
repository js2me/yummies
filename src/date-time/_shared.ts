import dayjs, { type Dayjs } from 'dayjs/esm/index.js';
import duration from 'dayjs/esm/plugin/duration/index.js';
import relativeTime from 'dayjs/esm/plugin/relativeTime/index.js';
import type { Maybe } from 'yummies/types';

import 'dayjs/esm/locale/ru.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale('ru');

export type RawDateToFormat = Date | string | number | Dayjs;

export { dayjs, type Dayjs };

export const toLibFormat = (value: Maybe<RawDateToFormat>): Dayjs | null => {
  let result: Maybe<Dayjs> = null;
  if (dayjs.isDayjs(value)) {
    result = value;
  } else if (value != null) {
    result = dayjs(value);
  }

  if (!result?.isValid()) {
    return null;
  }

  return result;
};
