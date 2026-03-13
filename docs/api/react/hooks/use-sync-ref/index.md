# Use Sync Ref

### useSyncRef()
Returns a ref whose `current` value is synchronized with the latest input
on every render.

**Examples:**

```ts
const latestHandler = useSyncRef(onSubmit);
latestHandler.current();
```

```ts
const latestValue = useSyncRef(props.value);
latestValue.current;
```

