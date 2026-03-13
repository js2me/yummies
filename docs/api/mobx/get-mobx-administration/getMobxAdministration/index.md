# getMobxAdministration()
Returns the internal MobX administration object associated with an observable target.

**Examples:**

```ts
const admin = getMobxAdministration(store);
admin.name_;
```

```ts
const values = getMobxAdministration(formState).values_;
```
