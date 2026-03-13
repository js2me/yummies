# ModulesFactory
Universal factory for creating class instances with predefined and per-call
dependencies.

Works with classes whose constructor accepts a single dependency object.

**Examples:**

```ts
const factory = new ModulesFactory({
  factory: (MyClass, deps) => new MyClass(deps),
  deps: { someDependency: new Dependency() }
});

const instance = factory.create(MyClass, { extraDependency: new ExtraDependency() });
```

```ts
const factory = new ModulesFactory({
  factory: (Module, deps) => new Module(deps),
});
```

```ts
const service = factory.create(UserService, { api });
```
