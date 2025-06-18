import { MaybeFn } from './utils/types.js';

/**
 * @deprecated use {MaybeFn} type
 */
export type FnValue<TValue, TArgs extends any[] = []> = MaybeFn<TValue, TArgs>;

export const resolveFnValue = <TValue, TArgs extends any[] = []>(
  // eslint-disable-next-line sonarjs/deprecation
  fn: FnValue<TValue, TArgs>,
  ...args: TArgs
) => {
  if (typeof fn === 'function') {
    return (fn as any)(...args) as TValue;
  }

  return fn;
};
