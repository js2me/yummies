import { sleep } from 'yummies/async';

/**
 * Lazily loads a module with retry support.
 *
 * @example
 * ```ts
 * fetchLazyModule(() => import('./test.ts'), 3) // starts loading test.ts
 * // If loading test.ts fails, fetchLazyModule retries by calling fetchModule() again
 * // It retries as many times as specified by attempts (3 by default)
 * ```
 */
export const fetchLazyModule = async <T>(
  fetchModule: () => Promise<T>,
  attempts = 3,
  delay = 1000,
): Promise<T> => {
  const attemptsArray = Array.from<typeof fetchModule>({
    length: attempts,
  }).fill(fetchModule);

  let lastError: null | Error = null;

  for await (const attempt of attemptsArray) {
    try {
      if (lastError !== null) {
        await sleep(delay);
      }
      return await attempt();
    } catch (error) {
      lastError = error as Error;
    }
  }
  throw lastError;
};

export type PackedAsyncModule<T> = Promise<T | { default: T }>;

/**
 * Resolves either a direct value or an asynchronously imported module and unwraps its `default` export.
 *
 * @example
 * ```ts
 * const component = await unpackAsyncModule(import('./Component.ts'));
 * ```
 */
export const unpackAsyncModule = async <T>(
  maybeModule: T | PackedAsyncModule<T>,
): Promise<T> => {
  if (maybeModule instanceof Promise) {
    const data = (await maybeModule) as any;

    if ((data as any).default) {
      return (data as any).default;
    } else {
      return data;
    }
  }

  return maybeModule;
};
