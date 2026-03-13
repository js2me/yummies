# Use Event Listener

### useEventListener()
Subscribes to a DOM event and keeps the latest handler without resubscribing
on every render.

Supports optional debounce and custom effect dependencies.

**Examples:**

```ts
useEventListener({
  event: 'click',
  handler: () => console.log('clicked'),
});
```

```ts
useEventListener({
  event: 'scroll',
  node: window,
  debounce: 100,
  handler: () => console.log('scroll'),
});
```

