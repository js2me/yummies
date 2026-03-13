# Use Abort Signal

### useAbortSignal()
Returns an `AbortSignal` tied to the component lifecycle.

The signal is aborted automatically on unmount.

**Examples:**

```ts
const signal = useAbortSignal();
fetch('/api/users', { signal });
```

```ts
const signal = useAbortSignal();
someAsyncTask({ signal });
```

