# Use Abort Controller

### useAbortController()
Creates a single `AbortController` instance for the component lifetime.

The controller is aborted automatically during unmount.

**Examples:**

```ts
const controller = useAbortController();
fetch('/api', { signal: controller.signal });
```

```ts
const controller = useAbortController();
controller.abort();
```

