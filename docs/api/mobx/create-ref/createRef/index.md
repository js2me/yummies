# createRef()
Creates a MobX-aware ref that behaves like a callback ref and exposes
observable `current` and `meta` fields.

**Example:**

```ts
```ts
const inputRef = createRef&lt;HTMLInputElement&gt;();
inputRef.set(document.createElement('input'));
```

```ts
const nodeRef = createRef(`
  onUnset: () =&gt; console.log('detached'),
  meta: { mounted: false `,
});
```
```
