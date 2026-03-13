# createGlobalConfig()
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
