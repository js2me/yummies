import { waitAsync } from './async.js';

/**
 * Функция ленивой загрузки модуля, с возможностью вызова доп. попыток
 * @example
 * ```ts
 * fetchLazyModule(() => import("./test.ts"), 3) // начнет загрузку test.ts
 * // Произошла ошибка загрузки test.ts, тогда fetchLazyModule повторно вызовет fn()
 * // Вызывать будет столько раз сколько указано attempts (по умолчанию 3)
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
        await waitAsync(delay);
      }
      return await attempt();
    } catch (error) {
      lastError = error as Error;
    }
  }
  throw lastError;
};
