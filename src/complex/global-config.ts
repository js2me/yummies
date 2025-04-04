import { AnyObject } from '../utils/types.js';

/**
 * Создает глобальный конфиг, который может быть доступен в любой точке в коде
 */
export const createGlobalConfig = <T extends AnyObject>(
  defaultValue: T,
  accessSymbol: any = Symbol(),
) => {
  const defaultViewModelsConfig: T = defaultValue;

  const _globalThis = globalThis as typeof globalThis & {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    [accessSymbol]?: T;
  };

  if (!_globalThis[accessSymbol]) {
    _globalThis[accessSymbol] = defaultViewModelsConfig;
  }

  return _globalThis[accessSymbol];
};
