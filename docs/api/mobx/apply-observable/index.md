# Apply Observable

### ObservableAnnotationsArray
_No description._


### applyObservable()
Applies a compact list of MobX annotations to an object using either
decorator-style invocation or the annotation map form accepted by `makeObservable`.

**Examples:**

```ts
applyObservable(store, [[observable, 'items'], [action, 'setItems']]);
```

```ts
applyObservable(viewModel, [[computed, 'fullName']], true);
```

