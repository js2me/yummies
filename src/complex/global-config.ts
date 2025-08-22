import type { AnyObject, Maybe } from '../utils/types.js';

const createGlobalPoint = <TValue>(accessSymbol?: keyof any) => {
  if (accessSymbol == null) {
    let storedValue: TValue | undefined;
    return {
      get: (): TValue => storedValue!,
      set: (value: TValue): TValue => {
        storedValue = value;
        return value;
      },
    };
  }

  const _globalThis = globalThis as AnyObject;

  return {
    get: (): TValue => _globalThis[accessSymbol],
    set: (value: TValue): TValue => {
      _globalThis[accessSymbol] = value;
      return value;
    },
  };
};

/**
 * Создает глобальный конфиг, который может быть доступен в любой точке в коде
 */
export const createGlobalConfig = <T extends AnyObject>(
  defaultValue: T,
  accessSymbol?: keyof any,
) => {
  const globalPoint = createGlobalPoint<T>(accessSymbol);
  return globalPoint.get() || globalPoint.set(defaultValue);
};

export const createGlobalDynamicConfig = <T extends AnyObject>(
  processFn: (change: Maybe<Partial<T>>, current: Maybe<T>) => T,
  accessSymbol?: keyof any,
) => {
  const globalPoint = createGlobalPoint<T | null | undefined>(accessSymbol);

  const getValue = () => {
    return globalPoint.get() ?? globalPoint.set(processFn(null, null))!;
  };

  return {
    get: getValue,
    set: globalPoint.set,
    update: (value: Partial<T>) => {
      const currentValue = getValue();
      Object.assign(currentValue, processFn(value, currentValue));
    },
  };
};
