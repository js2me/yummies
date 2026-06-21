import { getRandomInt } from './get-random-int.js';

/**
 * Picks a random element from the provided array.
 *
 * @example
 * ```ts
 * const fruit = getRandomChoice(['apple', 'banana', 'orange']);
 * ```
 */
export const getRandomChoice = <T>(arr: T[]): T =>
  arr[getRandomInt(0, arr.length - 1)];
