# applyObservable()
Applies a compact list of MobX annotations to an object using either
decorator-style invocation or the annotation map form accepted by `makeObservable`.

**Example:**

```ts
```ts
applyObservable(store, [[observable, 'items'], [action, 'setItems']]);
```

```ts
applyObservable(viewModel, [[computed, 'fullName']], true);
```
```
