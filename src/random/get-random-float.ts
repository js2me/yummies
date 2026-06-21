/**
 * Returns a random floating-point number between `min` and `max`.
 *
 * @example
 * ```ts
 * const value = getRandomFloat(1, 10);
 * ```
 */
export const getRandomFloat = <T extends number = number>(
  min = 0,
  max = 1,
): T => (Math.random() * (max - min) + min) as T;
