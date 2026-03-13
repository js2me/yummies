# Modules Factory

### ModulesFactory
Класс `ModulesFactory` является универсальной фабрикой для создания экземпляров указанного класса с зависимостями.
Он использует объект конфигурации для определения того, как эти экземпляры создаются.

Важное примечание - эта сущность работает только с классами конструктор которых имеет один параметр

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

