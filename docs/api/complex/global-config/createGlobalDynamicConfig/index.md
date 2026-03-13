# createGlobalDynamicConfig()
Creates a mutable global config manager whose value is produced and updated
through a custom processor function.

**Examples:**

```ts
const config = createGlobalDynamicConfig(
  (change, current) => ({ theme: 'light', ...current, ...change }),
  '__theme__',
);
```

```ts
const config = createGlobalDynamicConfig((change, current) => ({ ...current, ...change }));
config.update({ locale: 'ru' });
```
