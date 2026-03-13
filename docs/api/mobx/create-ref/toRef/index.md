# toRef()
Normalizes a plain value or an existing ref into a `Ref` instance.

**Examples:**

```ts
const ref = toRef(document.body);
ref.current === document.body;
```

```ts
const existingRef = createRef<number>();
const sameRef = toRef(existingRef);
```
