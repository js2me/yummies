/* eslint-disable sonarjs/no-globals-shadowing */
import { AnyFunction, AnyObject } from '../utils/types.js';

const enum Type {
  Null = 'null',
  Undefined = 'undefined',
  NaN = 'nan',
  Object = '[object Object]',
  Array = '[object Array]',
  String = '[object String]',
  Number = '[object Number]',
  Boolean = '[object Boolean]',
  Function = '[object Function]',
  RegExp = '[object RegExp]',
  Symbol = '[object Symbol]',
  Infinite = 'infinite',
  Element = 'element',
}

function getType(value: unknown): Type {
  if (value === undefined) {
    return Type.Undefined;
  }
  if (value === null) {
    return Type.Null;
  }

  // handle DOM elements
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (value && (value.nodeType === 1 || value.nodeType === 9)) {
    return Type.Element;
  }

  const stringifiedValue = Object.prototype.toString.call(value);

  // handle NaN and Infinity
  if (stringifiedValue === Type.Number) {
    if (Number.isNaN(value as number)) {
      return Type.NaN;
    }
    if (!Number.isFinite(value as number)) {
      return Type.Infinite;
    }
  }

  return stringifiedValue as Type;
}

const createTypeGuard =
  <T>(type: Type) =>
  (value: unknown): value is T =>
    getType(value) === type;

/**
 * Check if a value is not null or undefined
 * @param value the value to check
 * @returns boolean
 */
export const isDefined = <T>(value: T | undefined | null): value is T =>
  value != null;

/**
 * Check if a value is null
 * @param value the value to check
 * @returns boolean
 */
export const isNull = createTypeGuard<null>(Type.Null);

/**
 * Check if a value is undefined
 * @param value the value to check
 * @returns boolean
 */
export const isUndefined = createTypeGuard<undefined>(Type.Undefined);

/**
 * Check if a value is an object
 * @param value the value to check
 * @returns boolean
 */
export const isObject = createTypeGuard<AnyObject>(Type.Object);

/**
 * Check if a value is an array
 * @param value the value to check
 * @returns boolean
 */
export const isArray = createTypeGuard<unknown[]>(Type.Array);

/**
 * Check if a value is a string
 * @param value the value to check
 * @returns boolean
 */
export const isString = createTypeGuard<string>(Type.String);

/**
 * Check if a value is a number
 * @param value the value to check
 * @returns boolean
 */
export const isNumber = createTypeGuard<number>(Type.Number);

/**
 * Check if a value is a boolean
 * @param value the value to check
 * @returns boolean
 */
export const isBoolean = createTypeGuard<boolean>(Type.Boolean);

/**
 * Check if a value is a function
 * @param value the value to check
 * @returns boolean
 */
export const isFunction = createTypeGuard<AnyFunction>(Type.Function);

/**
 * Check if a value is a regular expression
 * @param value the value to check
 * @returns boolean
 */
export const isRegExp = createTypeGuard<RegExp>(Type.RegExp);

/**
 * Check if a value is a DOM element
 * @param value the value to check
 * @returns boolean
 */
export const isElement = createTypeGuard<HTMLElement>(Type.Element);

/**
 * Check if a value is NaN
 * @param value the value to check
 * @returns boolean
 */
export const isNaN = createTypeGuard<number>(Type.NaN) as (
  value: unknown,
) => boolean;

/**
 * Check if a value is infinity
 * @param value the value to check
 * @returns boolean
 */
export const isInfinite = createTypeGuard<number>(Type.Infinite) as (
  value: unknown,
) => boolean;

/**
 * Check if a value is a symbol
 * @param value the value to check
 * @returns boolean
 */
export const isSymbol = createTypeGuard<symbol>(Type.Symbol);
