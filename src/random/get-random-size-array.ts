import { getRandomInt } from './get-random-int.js';

/**
 * Creates an array filled with `null` values using a random length.
 *
 * @example
 * ```ts
 * const items = getRandomSizeArray(2, 5);
 * ```
 */
export const getRandomSizeArray = (min = 0, max = 10) =>
  Array.from({ length: getRandomInt(min, max) }).fill(null);
