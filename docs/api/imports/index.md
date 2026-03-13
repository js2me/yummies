# Imports

### fetchLazyModule()
Функция ленивой загрузки модуля, с возможностью вызова доп. попыток

**Example:**

```ts
```ts
fetchLazyModule(() =&gt; import("./test.ts"), 3) // начнет загрузку test.ts
// Произошла ошибка загрузки test.ts, тогда fetchLazyModule повторно вызовет fn()
// Вызывать будет столько раз сколько указано attempts (по умолчанию 3)
```
```


### PackedAsyncModule
_No description._


### unpackAsyncModule()
_No description._

