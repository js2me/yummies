import type { AnyObject } from 'yummies/types';

export interface GlobalPoint<TValue> {
  get(): TValue;
  set(value: TValue): TValue;
  unset(): void;
}

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
