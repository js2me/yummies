# Global Config

### createGlobalConfig()
Creates or reuses a globally accessible config object.

The config is stored in a global point identified by `accessSymbol`, or in a
local closure when no symbol is provided.

**Examples:**

```ts
const config = createGlobalConfig({ locale: 'en' }, '__app_config__');
```

```ts
const config = createGlobalConfig({ debug: false });
config.debug;
```


### GlobalDynamicConfig
_No description._


### createGlobalDynamicConfig()
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

