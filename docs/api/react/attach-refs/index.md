# Attach Refs

### attachRefs()
Assigns the same value to multiple React refs, including callback refs.

**Examples:**

```ts
attachRefs(node, localRef, forwardedRef);
```

```ts
attachRefs(null, inputRef, (value) => console.log(value));
```

