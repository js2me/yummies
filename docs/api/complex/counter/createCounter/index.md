# createCounter()
Creates a callable counter object with increment, decrement and reset helpers.

The returned function increments the internal numeric counter when called and
exposes both the raw counter value and an optionally transformed `value`.

**Examples:**

```ts
const counter = createCounter();
counter.increment(); // 1
```

```ts
const idCounter = createCounter((value) => `id-${value}`, 10);
idCounter(); // 'id-11'
```
