# isRef()
Checks whether the provided value is a ref created by `createRef`.

**Examples:**

```ts
const ref = createRef<number>();
isRef(ref); // true
```

```ts
isRef({ current: 1 }); // false
```
