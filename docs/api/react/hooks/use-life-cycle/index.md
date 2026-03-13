# Use Life Cycle

### useLifeCycle()
Runs mount and unmount callbacks returned by a factory function.

The latest factory is stored in a ref, while the effect itself is only
subscribed once.

**Example:**

```ts
```ts
useLifeCycle(() =&gt; (`
  mount: () =&gt; console.log('mounted'),
  unmount: () =&gt; console.log('unmounted'),
`));
```

```ts
useLifeCycle(() =&gt; (`
  mount: subscribe,
  unmount: unsubscribe,
`));
```
```

