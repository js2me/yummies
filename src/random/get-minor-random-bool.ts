import { getMajorRandomBool } from './get-major-random-bool.js';

/**
 * Returns `true` less often than `false`.
 *
 * @example
 * ```ts
 * const value = getMinorRandomBool();
 * ```
 */
export const getMinorRandomBool = () => {
  return !getMajorRandomBool();
};
