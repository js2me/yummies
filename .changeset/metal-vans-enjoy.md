---
"yummies": major
---

modified `applyObservable` mobx util function (`[field, annotation]` -> `[annotation, ...fields]`)   

Previous:   
```ts
applyObservable(this, [
  ['foo', observable],
  ['bar', observable],
])
```
New:   
```ts
applyObservable(this, [
  [observable, 'foo', 'bar'],
])
```