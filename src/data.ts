/* eslint-disable no-prototype-builtins */
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

  if (a.constructor !== b.constructor) return false;

  const isArrayA = Array.isArray(a);

  if (isArrayA !== Array.isArray(b)) return false;

  if (isArrayA) {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    if (arrA.length !== arrB.length) return false;

    for (const [i, element] of arrA.entries()) {
      if (element !== arrB[i]) return false;
    }
    return true;
  }

  if (a instanceof Date) return a.getTime() === (b as Date).getTime();

  if (a instanceof RegExp) return a.toString() === (b as RegExp).toString();

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  const bObj = b as AnyObject;
  for (const key of aKeys) {
    if (!bObj.hasOwnProperty(key) || (a as AnyObject)[key] !== bObj[key]) {
      return false;
    }
  }

  return true;
};

export const flatMapDeep = <TSource, TNewValue>(
  arr: TSource | TSource[],
  fn: (value: TSource, i: number, arr: TSource[]) => TNewValue,
): TNewValue[] =>
  Array.isArray(arr)
    ? arr.flatMap((c: TSource): TNewValue[] => flatMapDeep(c, fn))
    : [fn(arr, 0, [arr])];
