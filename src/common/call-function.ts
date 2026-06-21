import type { MaybeFn } from 'yummies/types';

/**
 * Normalizes a {@link MaybeFn} — a value that may be either a plain `TValue` or a function
 * `(...args: TArgs) => TValue`. If `fn` is callable, it is invoked with `args` and the return
 * value is returned; otherwise `fn` is returned as-is (treated as the resolved value).
 *
 * Typical uses: config fields that accept a static value or a lazy/computed factory, theme
 * tokens, labels, or callbacks where the caller should not branch on `typeof fn` themselves.
 *
 * @template TValue - Result type when `fn` is not a function, or return type when it is.
 * @template TArgs - Tuple of argument types passed through when `fn` is invoked.
 *
 * @param fn - Either a `TValue` or a function producing `TValue` from `args`.
 * @param args - Arguments forwarded to `fn` only when `fn` is a function.
 * @returns The resolved `TValue`.
 *
 * @example
 * Plain value — returned unchanged (no call):
 * ```ts
 * const n = callFunction(42); // 42
 * const label = callFunction('Hello'); // 'Hello'
 * ```
 *
 * @example
 * Function — called with the given arguments:
 * ```ts
 * const sum = callFunction((a: number, b: number) => a + b, 2, 3); // 5
 * ```
 *
 * @example
 * Same API for “static or factory” props:
 * ```ts
 * type Title = MaybeFn<string, [locale: string]>;
 * const title: Title = (loc) => (loc === 'ru' ? 'Привет' : 'Hi');
 * const text = callFunction(title, 'ru'); // 'Привет'
 * const fixed = callFunction('Hi', 'ru'); // 'Hi' — args ignored
 * ```
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
