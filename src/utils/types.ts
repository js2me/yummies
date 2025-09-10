/**
 * Extracts all values from an object or array type.
 *
 * @template T - The input type to extract values from
 * @returns The union of all possible values in T
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts enum keys as a union type.
 *
 * @template T - The enum type to extract keys from
 * @returns A union of all string keys in the enum
 */
export type ExtractEnumKeys<T> = ValueOf<{
  [key in keyof T]: key extends string ? key : never;
}>;

/**
 * Extracts enum values as a union type.
 *
 * @template T - The enum type to extract values from
 * @returns A union of all string and numeric values in the enum
 */
export type ExtractEnumValues<T> = `${T & string}` | (T & number);

/**
 * Represents a type that can be either the specified type or `undefined` or `null`.
 *
 * @template T - The input type
 * @returns T or `undefined` or `null`
 */
export type Maybe<T> = Nullable<T> | undefined;

/**
 * Represents a type that can be either the specified type or `null`.
 *
 * @template T - The type to make possibly `null`
 * @returns `T` or `null`
 */
export type Nullable<T> = T | null;

/**
 * Represents any object with any keys and any values.
 *
 * @returns Record with any keys and any values
 */
export type AnyObject = Record<keyof any, any>;

/**
 * Represents an empty object with no properties.
 *
 * @returns Record with no keys and no values
 */
export type EmptyObject = Record<keyof any, never>;

/**
 * Represents all primitive types in TypeScript.
 *
 * @returns Union of all primitive types
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/**
 * Represents any primitive type (string, number, boolean, null, or undefined).
 *
 * @deprecated use `Primitive` type
 *
 * @returns Union of all primitive types
 */
export type AnyPrimitive = Primitive;

/**
 * Represents any function type.
 *
 * @returns Function with any parameters and return type
 */
export type AnyFunction = (...args: any) => any;

/**
 * Converts a union type to an intersection type.
 *
 * @template U - The union type to convert
 * @returns Intersection of all types in the union
 */
export type UnionToIntersection<U> = (
  U extends any
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Represents falsy values (undefined, null, empty string, false, or 0).
 *
 * @returns Union of all falsy values
 */
export type FalsyValues = undefined | null | '' | false | 0;

/**
 * Represents a type that can be either the specified type, undefined, or any other falsy value.
 *
 * @template T - The type to make possibly falsy
 * @returns T, undefined, or a falsy value
 */
export type MaybeFalsy<T> = T | FalsyValues;

/**
 * Represents a type that can be either the specified type or a function returning that type.
 *
 * @template T - The type to make possibly a function
 * @template TArgs - Arguments type for the function
 * @returns T or a function that returns T
 */
export type MaybeFn<T, TArgs extends any[] = any[]> =
  | T
  | ((...args: TArgs) => T);

/**
 * Represents a class constructor type.
 *
 * @template T - The type the class constructs
 * @template Args - Constructor arguments type
 * @returns Constructor function for T with specified arguments
 */
export type Class<T, Args extends any[] = any[]> = new (...args: Args) => T;

/**
 * Creates a deeply partial version of a type, making all properties optional recursively.
 *
 * @template T - The type to make deeply partial
 * @returns A type with all properties optional at any depth
 */
export type DeepPartial<T> = T extends BrowserNativeObject
  ? T
  : {
      [K in keyof T]?: ExtractObjects<T[K]> extends never
        ? T[K]
        : DeepPartial<T[K]>;
    };

/**
 * Makes specified keys of a type optional while keeping the rest required.
 *
 * @template T - The original type
 * @template K - The keys to make optional
 * @returns A type with specified keys optional and others required
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Makes specified keys of a type required while keeping the rest optional.
 *
 * @template T - The original type
 * @template K - The keys to make required
 * @returns A type with specified keys required and others optional
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Extracts the inner type from a Promise type.
 *
 * @deprecated use `Awaited<T>` from stdlib of TypeScript
 *
 * @template T - The type that may be a Promise
 * @returns The resolved type of the Promise or T itself if not a Promise
 */
export type Unpromise<T> = T extends Promise<infer TValue> ? TValue : T;

/**
 * Makes all values in an object type possibly undefined.
 *
 * @template T - The object type to make values possibly undefined
 * @returns A type with all values possibly undefined
 */
export type MaybeValues<T extends AnyObject> = {
  [K in keyof T]: Maybe<T[K]>;
};

/**
 * Gets the keys of an object whose values match a specific type.
 *
 * @template T - The object type
 * @template TValues - The value type to match
 * @returns Union of keys whose values match TValues
 */
export type KeyOfByValue<T, TValues> = ValueOf<{
  [K in keyof T]: T[K] extends TValues ? K : never;
}>;

/**
 * Picks properties from an object whose values match a specific type.
 *
 * @template T - The object type
 * @template TValues - The value type to match
 * @returns A type with only the properties whose values match TValues
 */
export type PickByValue<T, TValues> = Pick<T, KeyOfByValue<T, TValues>>;

/**
 * Omits properties from an object whose values match a specific type.
 *
 * @template T - The object type
 * @template TValues - The value type to match
 * @returns A type with the properties whose values match TValues omitted
 */
export type OmitByValue<T, TValues> = Omit<T, KeyOfByValue<T, TValues>>;

/**
 * Determines if all properties in a type are optional.
 *
 * @template T - The type to check
 * @returns True if all properties are optional, false otherwise
 */
export type IsPartial<T> = keyof T extends never
  ? true
  : {
        [K in keyof T]-?: undefined extends T[K] ? never : K;
      } extends { [K in keyof T]: never }
    ? true
    : T extends EmptyObject
      ? true
      : false;

/**
 * @deprecated use `IsPartial<T>` . Better naming
 *
 * @template T - The type to check
 * @returns True if all properties are optional, false otherwise
 */
export type AllPropertiesOptional<T> = IsPartial<T>;

/**
 * Conditionally makes a type partially optional based on a condition.
 *
 * @template TCondition - The condition to check
 * @template TObject - The object type to make partial if condition is true
 * @returns Partial<TObject> if TCondition is true, otherwise TObject
 */
export type PartialIf<TCondition, TObject> = TCondition extends true
  ? Partial<TObject>
  : TObject;

/**
 * Converts a record type into an array of key-value pairs.
 *
 * @template T - The record type to convert
 * @returns Array of [key, value] tuples
 */
export type RecordEntries<T extends AnyObject> = T extends Record<
  infer Keys,
  infer Values
>
  ? [Keys, Values][]
  : T extends Partial<Record<infer Keys, infer Values>>
    ? [Keys, Values][]
    : never;

/**
 * Renames a key in an object type, preserving the optional nature of the property.
 *
 * @template TObject - The object type
 * @template TOldKey - The old key name
 * @template TNewKey - The new key name
 * @returns A type with the key renamed
 */
export type RenameKey<
  TObject,
  TOldKey extends keyof TObject,
  TNewKey extends string,
> = Omit<TObject, TOldKey> & IsPartial<Pick<TObject, TOldKey>> extends true
  ? { [K in TNewKey]?: TObject[TOldKey] }
  : { [K in TNewKey]: TObject[TOldKey] };

/**
 * Determines if an object type is empty (has no properties).
 *
 * @template T - The object type to check
 * @returns True if the object is empty, false otherwise
 */
export type IsObjectEmpty<T extends AnyObject> = T extends EmptyObject
  ? true
  : keyof T extends never
    ? true
    : never;

/**
 * Determines if an array type is empty.
 *
 * @template T - The array type to check
 * @returns True if the array is empty, false otherwise
 */
export type IsEmptyArray<T extends readonly any[]> = T extends []
  ? true
  : false;

/**
 * Extracts the parameter types from a function type.
 *
 * @template T - The function type to extract parameters from
 * @returns Union of all possible parameter types
 */
export type Params<T extends (...args: any) => any> = T extends {
  (...args: infer P1): any;
  (...args: infer P2): any;
}
  ? P1 | P2
  : T extends (...args: infer P) => any
    ? P
    : never;

/**
 * Represents browser native object types.
 *
 * @returns Union of browser native object types
 */
export type BrowserNativeObject = Date | FileList | File | Element | Node;

/**
 * Removes undefined from a type.
 *
 * @template T - The type to remove undefined from
 * @returns T with undefined removed
 */
export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Creates a literal union type that includes both a specific literal type and a primitive type.
 *
 * @template T - The literal type
 * @template U - The primitive type
 * @returns Union of T and U with a private property to prevent widening
 */
export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & {
      _?: never;
    });

/**
 * Extracts object types from a type, excluding primitives.
 *
 * @template T - The type to extract objects from
 * @returns T if it's an object, otherwise never
 */
export type ExtractObjects<T> = T extends infer U
  ? U extends object
    ? U
    : never
  : never;

/**
 * Replace value in object by key
 *
 * @example
 * ```ts
 * type Test = { foo: string; bar?: number };
 * type FixedTest = OverrideKey<Test, 'bar', string>
 * // { foo: string; bar?: string }
 * ```
 *
 * @template T - The object type
 * @template K - The key to replace
 * @template V - The new value type
 * @returns A type with the specified key replaced with the new value type
 */
export type OverrideKey<T, K extends keyof T, V> = {
  [KK in keyof T]: KK extends K ? V : T[KK];
};

/**
 * Checks if two types are equal.
 *
 * @template X - First type to compare
 * @template Y - Second type to compare
 * @returns True if types are equal, false otherwise
 */
export type IfEquals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * Gets the writable keys of a type (keys that are not readonly).
 *
 * @template T - The type to extract writable keys from
 * @returns Union of keys that are not readonly
 */
export type WritableKeys<T> = {
  [K in keyof T]: IfEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] }
  > extends true
    ? K
    : never;
}[keyof T];

/**
 * Gets the readonly keys of a type.
 *
 * @template T - The type to extract readonly keys from
 * @returns Union of keys that are readonly
 */
export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] }
  > extends true
    ? never
    : P;
}[keyof T];

/**
 * Gets the non-readonly properties of a type.
 *
 * @template T - The type to extract non-readonly properties from
 * @returns A type with only the non-readonly properties
 */
export type NonReadonly<T> = Pick<T, WritableKeys<T>>;

/**
 * Determines if a type is an array.
 *
 * @template T - The type to check
 * @returns True if the type is an array, false otherwise
 */
export type IsArray<T> = T extends object
  ? T extends Function
    ? false
    : T extends any[]
      ? true
      : false
  : false;

/**
 * Determines if a type is a function.
 *
 * @template T - The type to check
 * @returns True if the type is a function, false otherwise
 */
export type IsFunction<T> = T extends object
  ? T extends Function
    ? true
    : false
  : false;

/**
 * Determines if a type is an object (but not an array or function).
 *
 * @template T - The type to check
 * @returns True if the type is an object, false otherwise
 */
export type IsObject<T> = T extends object
  ? T extends Function
    ? false
    : T extends any[]
      ? false
      : true
  : false;

/**
 * Creates a deep copy of an object type, preserving the structure.
 *
 * @template T - The type to copy
 * @returns A deep copy of the type
 */
export type CopyObject<T> = IsObject<T> extends true
  ? {
      [K in keyof T]: IsObject<T[K]> extends true ? CopyObject<T[K]> : T[K];
    }
  : T;

/**
 * Represents a type that can be either the specified type or a Promise resolving to that type.
 *
 * @template T - The type to make possibly a promise
 * @returns T or Promise<T>
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Makes specified keys of a type required while keeping the rest optional.
 *
 * @template TTarget - The original type
 * @template TKey - The key(s) to make required
 * @returns A type with specified keys required and others optional
 */
export type WithRequired<TTarget, TKey extends keyof TTarget> = TTarget & {
  [_ in TKey]: {};
};

/**
 * Extracts the index keys from an array type.
 *
 * @template T - The array type to extract index keys from
 * @returns Union of index keys (string representations of numbers)
 */
export type IndexKeys<T extends any[]> = Extract<keyof T, `${number}`>;

/**
 * Removes undefined from a type.
 *
 * @template T - The type to remove undefined from
 * @returns T with undefined removed
 */
export type Defined<T> = Exclude<T, undefined>;
