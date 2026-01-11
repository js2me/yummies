import type { AnyObject, Maybe } from 'yummies/types';
import { createGlobalPoint } from './global-point.js';

/**
 * Создает глобальный конфиг, который может быть доступен в любой точке в коде
 */
export const createGlobalConfig = <T extends AnyObject>(
  defaultValue: T,
  accessSymbol?: keyof any,
): T => {
  const globalPoint = createGlobalPoint<T>(accessSymbol);
  return globalPoint.get() || globalPoint.set(defaultValue);
};

export interface GlobalDynamicConfig<TValue extends AnyObject> {
  get(): TValue;
  set(value: TValue): TValue;
  unset(): void;
  update(value: Partial<TValue>): void;
}

export const createGlobalDynamicConfig = <T extends AnyObject>(
  processFn: (change: Maybe<Partial<T>>, current: Maybe<T>) => T,
  accessSymbol?: keyof any,
): GlobalDynamicConfig<T> => {
  const globalPoint = createGlobalPoint<T>(accessSymbol);

  const getValue = () => {
    return globalPoint.get() ?? globalPoint.set(processFn(null, null))!;
  };

  return {
    get: getValue,
    set: globalPoint.set,
    unset: globalPoint.unset,
    update: (value: Partial<T>) => {
      const currentValue = getValue();
      Object.assign(currentValue, processFn(value, currentValue));
    },
  };
};
