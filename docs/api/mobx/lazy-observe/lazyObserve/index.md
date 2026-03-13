# lazyObserve()
Starts side effects only while one or more MobX observables are being observed.

When the first property becomes observed, `onStart` is called. When all tracked
properties become unobserved, `onEnd` is called with the value returned by
`onStart`. Cleanup can be delayed via `endDelay`.

It uses MobX `onBecomeObserved` and `onBecomeUnobserved` hooks to perform
lazy subscription management.

**Examples:**

```ts
const stop = lazyObserve({
  context: store,
  property: 'items',
  onStart: () => api.subscribe(),
  onEnd: (subscription) => subscription.unsubscribe(),
});
```

```ts
lazyObserve({
  property: [boxA, boxB],
  onStart: () => console.log('observed'),
  endDelay: 300,
});
```
