# Deep Observable Struct

### DeepObservableStruct
Wraps a plain object into a deeply observable structure and allows
patch-like updates while preserving nested observable references where possible.

**Example:**

```ts
```ts
const state = new DeepObservableStruct(` user: { name: 'Ann' ` });
state.set(` user: { name: 'Bob' ` });
```

```ts
const state = new DeepObservableStruct(` filters: { active: true ` });
state.set(` filters: { active: false, archived: true ` });
```
```

