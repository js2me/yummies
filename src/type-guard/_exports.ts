import type { AnyFunction, AnyObject, ValueOf } from 'yummies/types';

const TYPE = {
  Null: 'null',
  Undefined: 'undefined',
  NaN: 'nan',
  Object: '[object Object]',
  Array: '[object Array]',
  String: '[object String]',
  Number: '[object Number]',
  Boolean: '[object Boolean]',
  Function: '[object Function]',
  AsyncFunction: '[object AsyncFunction]',
  RegExp: '[object RegExp]',
  Symbol: '[object Symbol]',
  Infinite: 'infinite',
  Element: 'element',
};

type Type = ValueOf<typeof TYPE>;

function getType(value: unknown): Type {
  if (value === undefined) {
    return TYPE.Undefined;
  }
  if (value === null) {
    return TYPE.Null;
  }

  // handle DOM elements
  // @ts-expect-error
  if (value && (value.nodeType === 1 || value.nodeType === 9)) {
    return TYPE.Element;
  }

  const stringifiedValue = Object.prototype.toString.call(value);

  // handle NaN and Infinity
  if (stringifiedValue === TYPE.Number) {
    if (Number.isNaN(value as number)) {
      return TYPE.NaN;
    }
    if (!Number.isFinite(value as number)) {
      return TYPE.Infinite;
    }
  }

  return stringifiedValue as Type;
}

const createTypeGuard =
  <T>(...types: Type[]) =>
  (value: unknown): value is T =>
    types.includes(getType(value));

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
export const isNull = createTypeGuard<null>(TYPE.Null);

/**
 * Check if a value is undefined
 * @param value the value to check
 * @returns boolean
 */
export const isUndefined = createTypeGuard<undefined>(TYPE.Undefined);

/**
 * Check if a value is an object
 * @param value the value to check
 * @returns boolean
 */
export const isObject = createTypeGuard<AnyObject>(TYPE.Object);

/**
 * Check if a value is an array
 * @param value the value to check
 * @returns boolean
 */
export const isArray = createTypeGuard<unknown[]>(TYPE.Array);

/**
 * Check if a value is a string
 * @param value the value to check
 * @returns boolean
 */
export const isString = createTypeGuard<string>(TYPE.String);

/**
 * Check if a value is a number
 * @param value the value to check
 * @returns boolean
 */
export const isNumber = createTypeGuard<number>(TYPE.Number);

/**
 * Check if a value is a boolean
 * @param value the value to check
 * @returns boolean
 */
export const isBoolean = createTypeGuard<boolean>(TYPE.Boolean);

/**
 * Check if a value is a function
 * @param value the value to check
 * @returns boolean
 */
export const isFunction = createTypeGuard<AnyFunction>(
  TYPE.Function,
  TYPE.AsyncFunction,
);

/**
 * Check if a value is a regular expression
 * @param value the value to check
 * @returns boolean
 */
export const isRegExp = createTypeGuard<RegExp>(TYPE.RegExp);

/**
 * Check if a value is a DOM element
 * @param value the value to check
 * @returns boolean
 */
export const isElement = createTypeGuard<HTMLElement>(TYPE.Element);

/**
 * Check if a value is NaN
 * @param value the value to check
 * @returns boolean
 */
export const isNaN = createTypeGuard<number>(TYPE.NaN) as (
  value: unknown,
) => boolean;

/**
 * Check if a value is infinity
 * @param value the value to check
 * @returns boolean
 */
export const isInfinite = createTypeGuard<number>(TYPE.Infinite) as (
  value: unknown,
) => boolean;

/**
 * Check if a value is a symbol
 * @param value the value to check
 * @returns boolean
 */
export const isSymbol = createTypeGuard<symbol>(TYPE.Symbol);
