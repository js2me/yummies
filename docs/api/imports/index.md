# Imports

### fetchLazyModule()
Lazily loads a module with retry support.

**Example:**

```ts
fetchLazyModule(() => import('./test.ts'), 3) // starts loading test.ts
// If loading test.ts fails, fetchLazyModule retries by calling fetchModule() again
// It retries as many times as specified by attempts (3 by default)
```


### PackedAsyncModule
_No description._


### unpackAsyncModule()
_No description._

