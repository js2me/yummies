import type { AnyObject, Maybe } from 'yummies/types';
import { createGlobalPoint } from './global-point.js';

/**
 * Creates or reuses a globally accessible config object.
 *
 * The config is stored in a global point identified by `accessSymbol`, or in a
 * local closure when no symbol is provided.
 *
 * @template T Config object type.
 * @param defaultValue Default value used when no config has been created yet.
 * @param accessSymbol Optional global key used to store the config.
 * @returns Existing or newly initialized global config object.
 *
 * @example
 * ```ts
 * const config = createGlobalConfig({ locale: 'en' }, '__app_config__');
 * ```
 *
 * @example
 * ```ts
 * const config = createGlobalConfig({ debug: false });
 * config.debug;
 * ```
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

/**
 * Creates a mutable global config manager whose value is produced and updated
 * through a custom processor function.
 *
 * @template T Config object type.
 * @param processFn Function that builds the next config state from a partial change and current value.
 * @param accessSymbol Optional global key used to store the config.
 * @returns API for reading, replacing, resetting and partially updating the config.
 *
 * @example
 * ```ts
 * const config = createGlobalDynamicConfig(
 *   (change, current) => ({ theme: 'light', ...current, ...change }),
 *   '__theme__',
 * );
 * ```
 *
 * @example
 * ```ts
 * const config = createGlobalDynamicConfig((change, current) => ({ ...current, ...change }));
 * config.update({ locale: 'ru' });
 * ```
 */
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
