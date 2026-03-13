# Use Force Update

### useForceUpdate()
Forces a component re-render by updating an internal dummy state.

**Examples:**

```ts
const forceUpdate = useForceUpdate();
forceUpdate();
```

```ts
const rerender = useForceUpdate();
setTimeout(rerender, 1000);
```

