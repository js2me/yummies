import type { AnyObject, Maybe } from 'yummies/types';

/**
 * Performs a shallow comparison for arrays, plain objects, dates and regular expressions.
 *
 * @example
 * ```ts
 * isShallowEqual({ id: 1 }, { id: 1 }); // true
 * ```
 */
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
    if (!Object.hasOwn(bObj, key) || (a as AnyObject)[key] !== bObj[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Wraps a value in an array when it is not already an array.
 *
 * @example
 * ```ts
 * toArray('item'); // ['item']
 * ```
 */
export const toArray = <TValue>(value: TValue | TValue[]): TValue[] => {
  return Array.isArray(value) ? value : [value];
};

type DeepArray<TValue> = TValue | Array<DeepArray<TValue>>;

/**
 * Recursively flattens a nested array and maps the collected values.
 *
 * @example
 * ```ts
 * flatMapDeep([1, [2, [3]]], (value) => value * 2); // [2, 4, 6]
 * ```
 */
export const flatMapDeep = <TSource, TNewValue>(
  arr: DeepArray<TSource>,
  fn: (value: TSource, i: number, arr: TSource[]) => TNewValue,
): TNewValue[] => {
  const source: TSource[] = [];

  const collect = (value: DeepArray<TSource>): void => {
    if (!Array.isArray(value)) {
      source.push(value);
      return;
    }

    for (const item of value) {
      collect(item);
    }
  };

  collect(arr);

  return source.map((value, i) => fn(value, i, source));
};

/**
 * Parses JSON safely and returns a fallback value when parsing fails.
 *
 * @example
 * ```ts
 * safeJsonParse('{"enabled":true}', {}); // { enabled: true }
 * ```
 */
export const safeJsonParse = <TValue = any, TFallback = null>(
  json: Maybe<string>,
  fallback: TFallback = null as TFallback,
): TValue | TFallback => {
  if (json == null) return fallback;

  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

const UNSAFE_PROPERTY_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

/**
 * Checks whether a property key is unsafe and can lead to prototype pollution.
 *
 * @example
 * isUnsafeProperty('__proto__'); // true
 * isUnsafeProperty('name'); // false
 */
export const isUnsafeProperty = (key: any) => UNSAFE_PROPERTY_KEYS.has(key);
