# Modules Factory

### ModulesFactory
Universal factory for creating class instances with predefined and per-call
dependencies.

Works with classes whose constructor accepts a single dependency object.

**Example:**

```ts
```
const factory = new ModulesFactory(`
  factory: (MyClass, deps) =&gt; new MyClass(deps),
  deps: { someDependency: new Dependency() `
});

const instance = factory.create(MyClass, ` extraDependency: new ExtraDependency() `);
```
```

