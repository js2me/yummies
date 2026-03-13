# isRef()
Checks whether the provided value is a ref created by `createRef`.

**Example:**

```ts
```ts
const ref = createRef&lt;number&gt;();
isRef(ref); // true
```

```ts
isRef(` current: 1 `); // false
```
```
