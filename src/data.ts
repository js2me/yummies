import { AnyObject } from './utils/types.js';

export const isShallowEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);

  if (isArrayA !== isArrayB) return false;

  if (isArrayA && isArrayB) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  // eslint-disable-next-line no-prototype-builtins
  const hasAllKeys = aKeys.every((key) => (b as AnyObject).hasOwnProperty(key));
  if (!hasAllKeys) return false;

  return aKeys.every((key) => (a as AnyObject)[key] === (b as AnyObject)[key]);
};
