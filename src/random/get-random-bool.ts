import { getRandomInt } from './get-random-int.js';

/**
 * Returns a uniformly random boolean.
 *
 * @example
 * ```ts
 * const value = getRandomBool();
 * ```
 */
export const getRandomBool = () => getRandomInt(0, 1) === 1;
