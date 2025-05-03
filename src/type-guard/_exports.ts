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

export const isDefined = <T>(value: T | undefined | null): value is T =>
  value != null;

export const isNull = createTypeGuard<null>(Type.Null);
export const isUndefined = createTypeGuard<undefined>(Type.Undefined);
export const isObject = createTypeGuard<AnyObject>(Type.Object);
export const isArray = createTypeGuard<unknown[]>(Type.Array);
export const isString = createTypeGuard<string>(Type.String);
export const isNumber = createTypeGuard<number>(Type.Number);
export const isBoolean = createTypeGuard<boolean>(Type.Boolean);
export const isFunction = createTypeGuard<AnyFunction>(Type.Function);
export const isRegExp = createTypeGuard<boolean>(Type.RegExp);
export const isElement = createTypeGuard<HTMLElement>(Type.Element);
export const isNaN = createTypeGuard<number>(Type.NaN);
export const isInfinite = createTypeGuard<number>(Type.Infinite);
export const isSymbol = createTypeGuard<symbol>(Type.Symbol);
