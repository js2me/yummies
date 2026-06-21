import { getRandomFloat } from './get-random-float.js';

/**
 * Returns a random integer between `min` and `max`.
 *
 * @example
 * ```ts
 * const value = getRandomInt(1, 10);
 * ```
 */
export const getRandomInt = <T extends number = number>(min = 0, max = 1): T =>
  min === max ? (min as T) : (Math.round(getRandomFloat(min, max)) as T);
