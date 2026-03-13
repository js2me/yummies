# Use Constant

### useConstant()
React hook for creating a value exactly once.

Unlike `useMemo`, this guarantees that the initializer is executed only once
for the component lifetime.

**Examples:**

```ts
const id = useConstant(() => crypto.randomUUID());
```

```ts
const formatter = useConstant(() => new Intl.NumberFormat('en-US'));
```

