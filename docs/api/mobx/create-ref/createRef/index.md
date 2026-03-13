# createRef()
Creates a MobX-aware ref that behaves like a callback ref and exposes
observable `current` and `meta` fields.

**Examples:**

```ts
const inputRef = createRef<HTMLInputElement>();
inputRef.set(document.createElement('input'));
```

```ts
const nodeRef = createRef({
  onUnset: () => console.log('detached'),
  meta: { mounted: false },
});
```
