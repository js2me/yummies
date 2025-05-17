/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Extract all values from object or array
 */
export type ValueOf<T> = T[keyof T];

/** Converts enum keys to union */
export type ExtractEnumKeys<T> = ValueOf<{
  [key in keyof T]: key extends string ? key : never;
}>;

export type Maybe<T> = Nullable<T> | undefined;

export type Nullable<T> = T | null;

/**
 * Any object with any values
 */
export type AnyObject = Record<keyof any, any>;

/**
 * Empty object without properties
 */
export type EmptyObject = Record<keyof any, never>;

export type AnyPrimitive = string | number | boolean | null | undefined;

export type AnyFunction = (...args: any) => any;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type FalsyValues = undefined | null | '' | false | 0;

export type MaybeFalsy<T> = Maybe<T> | FalsyValues;

export type MaybeFn<T, TArgs extends any[] = any[]> =
  | T
  | ((...args: TArgs) => T);

export type Class<T, Args extends any[] = any[]> = new (...args: Args) => T;

/**
 * Все свойства будут опциональны, в любую глубину
 */
export type DeepPartial<T> = T extends BrowserNativeObject
  ? T
  : {
      [K in keyof T]?: ExtractObjects<T[K]> extends never
        ? T[K]
        : DeepPartial<T[K]>;
    };

export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type Unpromise<T> = T extends Promise<infer TValue> ? TValue : T;

export type MaybeValues<T extends AnyObject> = {
  [K in keyof T]: Maybe<T[K]>;
};

export type KeyOfByValue<T, TValues extends ValueOf<T>> = ValueOf<{
  [K in keyof T]: T[K] extends TValues ? K : never;
}>;

export type PickByValue<T, TValues extends ValueOf<T>> = Pick<
  T,
  KeyOfByValue<T, TValues>
>;

export type OmitByValue<T, TValues extends ValueOf<T>> = Omit<
  T,
  KeyOfByValue<T, TValues>
>;

export type AllPropertiesOptional<T> = keyof T extends never
  ? true
  : {
        [K in keyof T]-?: undefined extends T[K] ? never : K;
      } extends { [K in keyof T]: never }
    ? true
    : T extends EmptyObject
      ? true
      : false;

export type RecordEntries<T extends AnyObject> =
  T extends Record<infer Keys, infer Values>
    ? [Keys, Values][]
    : T extends Partial<Record<infer Keys, infer Values>>
      ? [Keys, Values][]
      : never;

export type RenameKey<
  TObject,
  TOldKey extends keyof TObject,
  TNewKey extends string,
> = Omit<TObject, TOldKey> &
  AllPropertiesOptional<Pick<TObject, TOldKey>> extends true
  ? { [K in TNewKey]?: TObject[TOldKey] }
  : { [K in TNewKey]: TObject[TOldKey] };

export type IsObjectEmpty<T extends AnyObject> = T extends EmptyObject
  ? true
  : keyof T extends never
    ? true
    : never;

export type IsEmptyArray<T extends readonly any[]> = T extends []
  ? true
  : false;

export type Params<T extends (...args: any) => any> = T extends {
  (...args: infer P1): any;
  (...args: infer P2): any;
}
  ? P1 | P2
  : T extends (...args: infer P) => any
    ? P
    : never;

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type BrowserNativeObject = Date | FileList | File | Element | Node;

export type NonUndefined<T> = T extends undefined ? never : T;

export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & {
      _?: never;
    });

export type ExtractObjects<T> = T extends infer U
  ? U extends object
    ? U
    : never
  : never;
