# createEnhancedAtom()
Creates a MobX atom extended with metadata and bound reporting methods.

**Examples:**

```ts
const atom = createEnhancedAtom('user-status');
atom.reportChanged();
```

```ts
const atom = createEnhancedAtom('cache', undefined, undefined, { scope: 'users' });
atom.meta.scope;
```
