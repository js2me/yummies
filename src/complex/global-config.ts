import { AnyObject } from '../utils/types.js';

const createGlobalPoint = <TValue>(accessSymbol: any) => {
  const _globalThis = globalThis as AnyObject;

  return {
    get: (): TValue => _globalThis[accessSymbol],
    set: (value: TValue): TValue => (_globalThis[accessSymbol] = value),
  };
};

/**
 * Создает глобальный конфиг, который может быть доступен в любой точке в коде
 */
export const createGlobalConfig = <T extends AnyObject>(
  defaultValue: T,
  accessSymbol: any = Symbol(),
) => {
  const globalPoint = createGlobalPoint<T>(accessSymbol);
  return globalPoint.get() || globalPoint.set(defaultValue);
};

export const createGlobalDynamicConfig = <T extends AnyObject>(
  fallbackFn: (currentValue: Partial<T> | null | undefined) => T,
  accessSymbol: any = Symbol(),
) => {
  const globalPoint = createGlobalPoint<T | null | undefined>(accessSymbol);

  const getValue = () => {
    const currentValue = globalPoint.get();
    if (currentValue == null) {
      return globalPoint.set(fallbackFn(null))!;
    }
    return currentValue;
  };

  return {
    get: getValue,
    set: globalPoint.set,
    update: (value: Partial<T>) => {
      const currentValue = getValue();
      Object.assign(currentValue, value);
    },
  };
};
