import { IsPartial, AnyObject, Class, EmptyObject } from '../utils/types.js';

type ModuleLoaderConfig<TPredefinedDeps extends AnyObject = EmptyObject> = {
  factory<TInstance, TDeps extends TPredefinedDeps>(
    moduleClass: Class<TInstance, [TDeps]>,
    deps: TDeps,
  ): TInstance;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & (TPredefinedDeps extends EmptyObject
  ? { deps?: TPredefinedDeps }
  : { deps: TPredefinedDeps });

/**
 * Класс `ModulesFactory` является универсальной фабрикой для создания экземпляров указанного класса с зависимостями.
 * Он использует объект конфигурации для определения того, как эти экземпляры создаются.
 *
 * Важное примечание - эта сущность работает только с классами конструктор которых имеет один параметр
 *
 * @template TPredefinedDeps - Тип, расширяющий `AnyObject`, представляющий предопределенные зависимости, которые использует фабрика.
 *
 * @example
 * ```
 * const factory = new ModulesFactory({
 *   factory: (MyClass, deps) => new MyClass(deps),
 *   deps: { someDependency: new Dependency() }
 * });
 *
 * const instance = factory.create(MyClass, { extraDependency: new ExtraDependency() });
 * ```
 */
export class ModulesFactory<TPredefinedDeps extends AnyObject = EmptyObject> {
  /**
   * Создает новый экземпляр `ModulesFactory`.
   *
   * @param config - Объект конфигурации для фабрики, включающий функцию фабрики и необязательные зависимости.
   */
  constructor(private config: ModuleLoaderConfig<TPredefinedDeps>) {}

  /**
   * Создает экземпляр указанного класса, внедряя необходимые зависимости.
   *
   * @template TInstance - Тип создаваемого экземпляра.
   * @template TDeps - Тип зависимостей, необходимых для экземпляра.
   *
   * @param Constructor - Конструктор класса для создаваемого экземпляра.
   * @param args - Необязательные дополнительные зависимости для объединения с предопределенными зависимостями.
   *
   * @returns Экземпляр указанного класса с внедренными зависимостями.
   */
  create<TInstance, TDeps extends TPredefinedDeps = TPredefinedDeps>(
    Constructor: Class<TInstance, [TDeps]>,
    ...args: IsPartial<Omit<TDeps, keyof TPredefinedDeps>> extends true
      ? [extraDeps?: Omit<TDeps, keyof TPredefinedDeps>]
      : [extraDeps: Omit<TDeps, keyof TPredefinedDeps>]
  ) {
    return this.config.factory(Constructor, {
      ...this.config.deps!,
      ...args[0],
    } as any);
  }
}
