import { AnyObject } from '../utils/types.js';

const createGlobalPoint = (accessSymbol: any) => {
  const _globalThis = globalThis as AnyObject;

  return {
    get: () => _globalThis[accessSymbol],
    set: (value: any) => (_globalThis[accessSymbol] = value),
  };
};

/**
 * Создает глобальный конфиг, который может быть доступен в любой точке в коде
 */
export const createGlobalConfig = <T extends AnyObject>(
  defaultValue: T,
  accessSymbol: any = Symbol(),
) => {
  const globalPoint = createGlobalPoint(accessSymbol);
  return globalPoint.get() || globalPoint.set(defaultValue);
};

export const createGlobalDynamicConfig = <T extends AnyObject>(
  updateFn?: (value: Partial<T>) => Partial<T>,
  accessSymbol: any = Symbol(),
) => {
  const globalPoint = createGlobalPoint(accessSymbol);

  return {
    ...globalPoint,
    update: (value: Partial<T>) => {
      Object.assign(globalPoint.get(), updateFn ? updateFn(value) : value);
    },
  };
};
