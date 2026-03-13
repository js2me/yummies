# Types

### ValueOf
Extracts all values from an object or array type.


### ExtractEnumKeys
Extracts enum keys as a union type.


### ExtractEnumValues
Extracts enum values as a union type.


### Maybe
Represents a type that can be either the specified type or `undefined` or `null`.


### NotMaybe
Removes `null` and `undefined` from a type.


### Nullable
Represents a type that can be either the specified type or `null`.


### NotNullable
Removes `null` from a type.


### AnyObject
Represents any object with any keys and any values.


### Dict
Represents dictionary with any keys and expecting values;


### EmptyObject
Represents an empty object with no properties.


### MaybeArray
T or T[];


### Primitive
Represents all primitive types in TypeScript.


### AnyPrimitive
**Deprecated:** use `Primitive` type

Represents any primitive type (string, number, boolean, null, or undefined).


### AnyFunction
Represents any function type.


### UnionToIntersection
Converts a union type to an intersection type.


### FalsyValues
Represents falsy values (undefined, null, empty string, false, or 0).


### MaybeFalsy
Represents a type that can be either the specified type, undefined, or any other falsy value.


### Fn
_No description._


### MaybeFn
Represents a type that can be either the specified type or a function returning that type.


### Class
Represents a class constructor type.


### DeepPartial
Creates a deeply partial version of a type, making all properties optional recursively.


### PartialKeys
Makes specified keys of a type optional while keeping the rest required.


### MaybeKeys
Makes specified keys of a type possibly Maybe<T> while keeping the rest required.


### RequiredKeys
Makes specified keys of a type required while keeping the rest optional.


### Unpromise
**Deprecated:** use `Awaited<T>` from stdlib of TypeScript

Extracts the inner type from a Promise type.


### MaybeValues
Makes all values in an object type possibly undefined.


### KeyOfByValue
Gets the keys of an object whose values match a specific type.


### PickByValue
Picks properties from an object whose values match a specific type.


### OmitByValue
Omits properties from an object whose values match a specific type.


### IsPartial
Determines if all properties in a type are optional.


### AllPropertiesOptional
**Deprecated:** use `IsPartial<T>` . Better naming

_No description._


### PartialIf
Conditionally makes a type partially optional based on a condition.


### RecordEntries
Converts a record type into an array of key-value pairs.


### RenameKey
Renames a key in an object type, preserving the optional nature of the property.


### IsObjectEmpty
Determines if an object type is empty (has no properties).


### IsEmptyArray
Determines if an array type is empty.


### Params
Extracts the parameter types from a function type.


### BrowserNativeObject
Represents browser native object types.


### NonUndefined
Removes undefined from a type.


### LiteralUnion
Creates a literal union type that includes both a specific literal type and a primitive type.


### ExtractObjects
Extracts object types from a type, excluding primitives.


### OverrideKey
Replace value in object by key

**Example:**

```ts
```ts
type Test = ` foo: string; bar?: number `;
type FixedTest = OverrideKey<Test, 'bar', string>
// ` foo: string; bar?: string `
```
```


### IfEquals
Checks if two types are equal.


### WritableKeys
Gets the writable keys of a type (keys that are not readonly).


### ReadonlyKeys
Gets the readonly keys of a type.


### NonReadonly
Gets the non-readonly properties of a type.


### IsArray
Determines if a type is an array.


### IsFunction
Determines if a type is a function.


### IsObject
Determines if a type is an object (but not an array or function).


### CopyObject
Creates a deep copy of an object type, preserving the structure.


### MaybePromise
Represents a type that can be either the specified type or a Promise resolving to that type.


### WithRequired
Makes specified keys of a type required while keeping the rest optional.


### IndexKeys
Extracts the index keys from an array type.


### Defined
Removes undefined from a type.


### HasKey
Check existing key in object (T)


### HasSpecificKey
**Deprecated:** use `HasKey`

_No description._


### IsAny
Checks type is any

Returns true if T is any


### IsUnknown
_No description._


### AnyString
Helpful to use with union type literals (`'str1' | 'str2' | AnyString`)


### AnyNumber
Helpful to use with union type literals (`1 | 2 | AnyNumber`)


### AnyBoolean
Helpful to use with union type literals (`true | AnyBoolean`)


### UpperFirst
Upperfirst string type. It will capitalize the first letter of the string
and leave the rest of the string unchanged.

