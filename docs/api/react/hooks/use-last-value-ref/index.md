# Use Last Value Ref

### useLastValueRef()
Returns a ref that always points to the last non-nullish value.

**Examples:**

```ts
const latestUserRef = useLastValueRef(user);
latestUserRef.current;
```

```ts
const latestNodeRef = useLastValueRef<HTMLDivElement | null>(node);
```

