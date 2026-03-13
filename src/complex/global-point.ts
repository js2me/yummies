import type { AnyObject } from 'yummies/types';

export interface GlobalPoint<TValue> {
  get(): TValue;
  set(value: TValue): TValue;
  unset(): void;
}

/**
 * Creates a simple storage point that can live either in `globalThis` under a
 * provided key or in a local closure when no key is given.
 *
 * @template TValue Stored value type.
 * @param accessSymbol Optional global property name used for storage.
 * @returns Getter/setter API for the stored value.
 *
 * @example
 * ```ts
 * const point = createGlobalPoint<number>();
 * point.set(10);
 * ```
 *
 * @example
 * ```ts
 * const point = createGlobalPoint<string>('__token__');
 * point.get();
 * ```
 */
export const createGlobalPoint = <TValue>(
  accessSymbol?: keyof any,
): GlobalPoint<TValue> => {
  if (accessSymbol == null) {
    let storedValue: TValue | undefined;

    return {
      get: (): TValue => storedValue!,
      unset: () => {
        storedValue = undefined;
      },
      set: (value: TValue): TValue => {
        storedValue = value;
        return value;
      },
    };
  }

  const _globalThis = globalThis as AnyObject;

  return {
    get: (): TValue => _globalThis[accessSymbol],
    unset: () => {
      delete _globalThis[accessSymbol];
    },
    set: (value: TValue): TValue => {
      _globalThis[accessSymbol] = value;
      return value;
    },
  };
};
