# Use Initial Height

### useInitialHeight()
Captures an element's height the first time its ref becomes available.

**Examples:**

```ts
const { ref, initialHeight } = useInitialHeight<HTMLDivElement>();
```

```ts
const state = useInitialHeight<HTMLTextAreaElement>();
state.initialHeight;
```

