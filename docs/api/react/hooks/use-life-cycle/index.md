# Use Life Cycle

### useLifeCycle()
Runs mount and unmount callbacks returned by a factory function.

The latest factory is stored in a ref, while the effect itself is only
subscribed once.

**Examples:**

```ts
useLifeCycle(() => ({
  mount: () => console.log('mounted'),
  unmount: () => console.log('unmounted'),
}));
```

```ts
useLifeCycle(() => ({
  mount: subscribe,
  unmount: unsubscribe,
}));
```

