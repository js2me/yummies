import type { ManipulateType } from 'dayjs/esm/index.js';
import type { Maybe } from 'yummies/types';
import { type RawDateToFormat, toLibFormat } from './_shared.js';

type DateChangeParam = [amount: number, unit?: Maybe<ManipulateType>];

/**
 * Applies one or more date adjustments and returns a new `Date` instance.
 *
 * @example
 * ```ts
 * changeDate(new Date(), 1, 'day', 30, 'minute');
 * ```
 */
export const changeDate = (
  date: Maybe<RawDateToFormat>,
  ...args: [
    ...DateChangeParam,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
    ...Partial<DateChangeParam>,
  ]
) => {
  let wrappedDate = toLibFormat(date)!;

  for (let i = 0; i < args.length; i += 2) {
    const amount = args[i] as DateChangeParam[0];
    const unit = args[i + 1] as DateChangeParam[1];
    if (unit != null) {
      wrappedDate = wrappedDate.add(amount, unit);
    }
  }

  return wrappedDate.toDate();
};
