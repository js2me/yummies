# Get Mobx Administration

### getMobxAdministration()
Returns the internal MobX administration object associated with an observable target.

**Example:**

```ts
```ts
const admin = getMobxAdministration(store);
admin.name_;
```

```ts
const values = getMobxAdministration(formState).values_;
```
```

