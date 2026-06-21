import { getRandomInt } from './get-random-int.js';

/**
 * Returns `true` more often than `false`.
 *
 * @example
 * ```ts
 * const value = getMajorRandomBool();
 * ```
 */
export const getMajorRandomBool = () => {
  return getRandomInt(0, 10) <= 6;
};
