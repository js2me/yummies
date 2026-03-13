# Global Point

### GlobalPoint
_No description._


### createGlobalPoint()
Creates a simple storage point that can live either in `globalThis` under a
provided key or in a local closure when no key is given.

**Examples:**

```ts
const point = createGlobalPoint<number>();
point.set(10);
```

```ts
const point = createGlobalPoint<string>('__token__');
point.get();
```

