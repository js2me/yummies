import { AnyFunction, AnyObject } from './utils/types.js';

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

const isDefined = <T>(value: T | undefined | null): value is T => value != null;

export const typeGuard = {
  isNull: createTypeGuard<null>(Type.Null),
  isUndefined: createTypeGuard<undefined>(Type.Undefined),
  isObject: createTypeGuard<AnyObject>(Type.Object),
  isArray: createTypeGuard<unknown[]>(Type.Array),
  isString: createTypeGuard<string>(Type.String),
  isNumber: createTypeGuard<number>(Type.Number),
  isBoolean: createTypeGuard<boolean>(Type.Boolean),
  isFunction: createTypeGuard<AnyFunction>(Type.Function),
  isRegExp: createTypeGuard<boolean>(Type.RegExp),
  isElement: createTypeGuard<HTMLElement>(Type.Element),
  isNaN: createTypeGuard<number>(Type.NaN),
  isInfinite: createTypeGuard<number>(Type.Infinite),
  isSymbol: createTypeGuard<symbol>(Type.Symbol),
  isDefined,
};
