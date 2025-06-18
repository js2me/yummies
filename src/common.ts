import { MaybeFn } from './utils/types.js';

/**
 * @deprecated use {MaybeFn} type
 */
export type FnValue<TValue, TArgs extends any[] = []> = MaybeFn<TValue, TArgs>;

/**
 * Calls the provided function with the given arguments if it is a function;
 * otherwise, returns the value directly.
 */
export const callFunction = <TValue, TArgs extends any[] = []>(
  fn: MaybeFn<TValue, TArgs>,
  ...args: TArgs
) => {
  if (typeof fn === 'function') {
    return (fn as any)(...args) as TValue;
  }

  return fn;
};

/**
 * @deprecated use {callFunction}
 */
export const resolveFnValue = callFunction;
