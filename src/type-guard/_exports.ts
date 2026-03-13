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
 * Checks that a value is neither `null` nor `undefined`.
 *
 * @template T Value type without nullish branches.
 * @param value Value to test.
 * @returns `true` when the value is defined.
 *
 * @example
 * ```ts
 * isDefined(0); // true
 * ```
 *
 * @example
 * ```ts
 * isDefined(null); // false
 * ```
 */
export const isDefined = <T>(value: T | undefined | null): value is T =>
  value != null;

/**
 * Checks whether a value is exactly `null`.
 *
 * @param value Value to test.
 * @returns `true` when the value is `null`.
 *
 * @example
 * ```ts
 * isNull(null); // true
 * ```
 *
 * @example
 * ```ts
 * isNull(undefined); // false
 * ```
 */
export const isNull = createTypeGuard<null>(TYPE.Null);

/**
 * Checks whether a value is exactly `undefined`.
 *
 * @param value Value to test.
 * @returns `true` when the value is `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * ```
 *
 * @example
 * ```ts
 * isUndefined('value'); // false
 * ```
 */
export const isUndefined = createTypeGuard<undefined>(TYPE.Undefined);

/**
 * Checks whether a value is a plain object.
 *
 * @param value Value to test.
 * @returns `true` when the value matches `[object Object]`.
 *
 * @example
 * ```ts
 * isObject({ id: 1 }); // true
 * ```
 *
 * @example
 * ```ts
 * isObject([]); // false
 * ```
 */
export const isObject = createTypeGuard<AnyObject>(TYPE.Object);

/**
 * Checks whether a value is an array.
 *
 * @param value Value to test.
 * @returns `true` when the value is an array.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * ```
 *
 * @example
 * ```ts
 * isArray({ length: 1 }); // false
 * ```
 */
export const isArray = createTypeGuard<unknown[]>(TYPE.Array);

/**
 * Checks whether a value is a string object or primitive string.
 *
 * @param value Value to test.
 * @returns `true` when the value is a string.
 *
 * @example
 * ```ts
 * isString('hello'); // true
 * ```
 *
 * @example
 * ```ts
 * isString(123); // false
 * ```
 */
export const isString = createTypeGuard<string>(TYPE.String);

/**
 * Checks whether a value is a finite number.
 *
 * Unlike `isNaN` and `isInfinite`, this guard only matches regular numeric values.
 *
 * @param value Value to test.
 * @returns `true` when the value is a non-NaN finite number.
 *
 * @example
 * ```ts
 * isNumber(123); // true
 * ```
 *
 * @example
 * ```ts
 * isNumber(Number.NaN); // false
 * ```
 */
export const isNumber = createTypeGuard<number>(TYPE.Number);

/**
 * Checks whether a value is a boolean.
 *
 * @param value Value to test.
 * @returns `true` when the value is a boolean.
 *
 * @example
 * ```ts
 * isBoolean(true); // true
 * ```
 *
 * @example
 * ```ts
 * isBoolean('true'); // false
 * ```
 */
export const isBoolean = createTypeGuard<boolean>(TYPE.Boolean);

/**
 * Checks whether a value is a synchronous or asynchronous function.
 *
 * @param value Value to test.
 * @returns `true` when the value is a function.
 *
 * @example
 * ```ts
 * isFunction(() => {}); // true
 * ```
 *
 * @example
 * ```ts
 * isFunction(async () => {}); // true
 * ```
 */
export const isFunction = createTypeGuard<AnyFunction>(
  TYPE.Function,
  TYPE.AsyncFunction,
);

/**
 * Checks whether a value is a regular expression.
 *
 * @param value Value to test.
 * @returns `true` when the value is a `RegExp`.
 *
 * @example
 * ```ts
 * isRegExp(/foo/); // true
 * ```
 *
 * @example
 * ```ts
 * isRegExp('foo'); // false
 * ```
 */
export const isRegExp = createTypeGuard<RegExp>(TYPE.RegExp);

/**
 * Checks whether a value looks like a DOM element or document node.
 *
 * @param value Value to test.
 * @returns `true` when the value has an element-like node type.
 *
 * @example
 * ```ts
 * isElement(document.body); // true
 * ```
 *
 * @example
 * ```ts
 * isElement({ nodeType: 3 }); // false
 * ```
 */
export const isElement = createTypeGuard<HTMLElement>(TYPE.Element);

/**
 * Checks whether a value is `NaN`.
 *
 * @param value Value to test.
 * @returns `true` when the value is `NaN`.
 *
 * @example
 * ```ts
 * isNaN(Number.NaN); // true
 * ```
 *
 * @example
 * ```ts
 * isNaN(5); // false
 * ```
 */
export const isNaN = createTypeGuard<number>(TYPE.NaN) as (
  value: unknown,
) => boolean;

/**
 * Checks whether a value is positive or negative infinity.
 *
 * @param value Value to test.
 * @returns `true` when the value is not finite.
 *
 * @example
 * ```ts
 * isInfinite(Infinity); // true
 * ```
 *
 * @example
 * ```ts
 * isInfinite(10); // false
 * ```
 */
export const isInfinite = createTypeGuard<number>(TYPE.Infinite) as (
  value: unknown,
) => boolean;

/**
 * Checks whether a value is a symbol.
 *
 * @param value Value to test.
 * @returns `true` when the value is a symbol.
 *
 * @example
 * ```ts
 * isSymbol(Symbol('id')); // true
 * ```
 *
 * @example
 * ```ts
 * isSymbol('id'); // false
 * ```
 */
export const isSymbol = createTypeGuard<symbol>(TYPE.Symbol);
