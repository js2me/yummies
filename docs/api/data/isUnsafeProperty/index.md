# isUnsafeProperty()
Checks whether a property key is unsafe and can lead to prototype pollution.

**Example:**

```ts
isUnsafeProperty('__proto__'); // true
isUnsafeProperty('name'); // false
```
