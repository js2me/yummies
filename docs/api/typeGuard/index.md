# typeGuard

### typeGuard.isDefined()
Checks that a value is neither `null` nor `undefined`.

**Examples:**

```ts
isDefined(0); // true
```

```ts
isDefined(null); // false
```


### typeGuard.isNull
Checks whether a value is exactly `null`.

**Examples:**

```ts
isNull(null); // true
```

```ts
isNull(undefined); // false
```


### typeGuard.isUndefined
Checks whether a value is exactly `undefined`.

**Examples:**

```ts
isUndefined(undefined); // true
```

```ts
isUndefined('value'); // false
```


### typeGuard.isObject
Checks whether a value is a plain object.

**Examples:**

```ts
isObject({ id: 1 }); // true
```

```ts
isObject([]); // false
```


### typeGuard.isArray
Checks whether a value is an array.

**Examples:**

```ts
isArray([1, 2, 3]); // true
```

```ts
isArray({ length: 1 }); // false
```


### typeGuard.isString
Checks whether a value is a string object or primitive string.

**Examples:**

```ts
isString('hello'); // true
```

```ts
isString(123); // false
```


### typeGuard.isNumber
Checks whether a value is a finite number.

Unlike `isNaN` and `isInfinite`, this guard only matches regular numeric values.

**Examples:**

```ts
isNumber(123); // true
```

```ts
isNumber(Number.NaN); // false
```


### typeGuard.isBoolean
Checks whether a value is a boolean.

**Examples:**

```ts
isBoolean(true); // true
```

```ts
isBoolean('true'); // false
```


### typeGuard.isFunction
Checks whether a value is a synchronous or asynchronous function.

**Examples:**

```ts
isFunction(() => {}); // true
```

```ts
isFunction(async () => {}); // true
```


### typeGuard.isRegExp
Checks whether a value is a regular expression.

**Examples:**

```ts
isRegExp(/foo/); // true
```

```ts
isRegExp('foo'); // false
```


### typeGuard.isElement
Checks whether a value looks like a DOM element or document node.

**Examples:**

```ts
isElement(document.body); // true
```

```ts
isElement({ nodeType: 3 }); // false
```


### typeGuard.isNaN
Checks whether a value is `NaN`.

**Examples:**

```ts
isNaN(Number.NaN); // true
```

```ts
isNaN(5); // false
```


### typeGuard.isInfinite
Checks whether a value is positive or negative infinity.

**Examples:**

```ts
isInfinite(Infinity); // true
```

```ts
isInfinite(10); // false
```


### typeGuard.isSymbol
Checks whether a value is a symbol.

**Examples:**

```ts
isSymbol(Symbol('id')); // true
```

```ts
isSymbol('id'); // false
```

