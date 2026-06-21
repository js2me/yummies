import type { AnyObject } from 'yummies/types';

/**
 * Checks whether an object has at least one enumerable key.
 *
 * @example
 * ```ts
 * hasEnumerableKeys({ id: 1 }); // true
 * hasEnumerableKeys({}); // false
 * ```
 */
export const hasEnumerableKeys = (input: AnyObject): boolean => {
  for (const _key in input) {
    return true;
  }
  return false;
};
