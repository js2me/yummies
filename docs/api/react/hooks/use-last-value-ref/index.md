# Use Last Value Ref

### useLastValueRef()
Returns a ref that always points to the last non-nullish value.

**Example:**

```ts
```ts
const latestUserRef = useLastValueRef(user);
latestUserRef.current;
```

```ts
const latestNodeRef = useLastValueRef&lt;HTMLDivElement | null&gt;(node);
```
```

