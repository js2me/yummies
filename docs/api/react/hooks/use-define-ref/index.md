# Use Define Ref

### useDefineRef()
Creates a mutable ref whose value is initialized exactly once.

**Examples:**

```ts
const cacheRef = useDefineRef(() => new Map());
```

```ts
const observerRef = useDefineRef(() => new ResizeObserver(() => {}));
```

