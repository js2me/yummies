# Use Toggle

### useToggle()
Manages a boolean state and returns helpers to toggle or set it directly.

**Examples:**

```ts
const [open, toggleOpen] = useToggle();
toggleOpen();
```

```ts
const [enabled, , setEnabled] = useToggle(true);
setEnabled(false);
```

