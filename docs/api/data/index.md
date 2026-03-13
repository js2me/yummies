# Data

### isShallowEqual()
_No description._


### toArray()
_No description._


### flatMapDeep()
_No description._


### safeJsonParse()
_No description._


### isUnsafeProperty()
Checks whether a property key is unsafe and can lead to prototype pollution.

**Example:**

```ts
isUnsafeProperty('__proto__'); // true
isUnsafeProperty('name'); // false
```

