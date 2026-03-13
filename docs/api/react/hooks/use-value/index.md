# Use Value

### useValue()
Wraps `useState` and returns the state value as an object with a `set` method.

**Examples:**

```ts
const counter = useValue(0);
counter.set(1);
```

```ts
const user = useValue(() => ({ name: 'Ann' }));
user.value.name;
```

