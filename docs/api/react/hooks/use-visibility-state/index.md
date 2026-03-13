# Use Visibility State

### useVisibilityState()
Tracks `document.visibilityState` and updates when the page visibility changes.

**Examples:**

```ts
const visibility = useVisibilityState();
```

```ts
const isHidden = useVisibilityState() === 'hidden';
```

