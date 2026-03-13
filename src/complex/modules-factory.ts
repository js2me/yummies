import type { AnyObject, Class, EmptyObject, IsPartial } from 'yummies/types';

type ModuleLoaderConfig<TPredefinedDeps extends AnyObject = EmptyObject> = {
  factory<TInstance, TDeps extends TPredefinedDeps>(
    moduleClass: Class<TInstance, [TDeps]>,
    deps: TDeps,
  ): TInstance;
} & (TPredefinedDeps extends EmptyObject
  ? { deps?: TPredefinedDeps }
  : { deps: TPredefinedDeps });

/**
 * Universal factory for creating class instances with predefined and per-call
 * dependencies.
 *
 * Works with classes whose constructor accepts a single dependency object.
 *
 * @template TPredefinedDeps Dependency shape that is always injected by the factory.
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
 *
 * @example
 * ```ts
 * const factory = new ModulesFactory({
 *   factory: (Module, deps) => new Module(deps),
 * });
 * ```
 *
 * @example
 * ```ts
 * const service = factory.create(UserService, { api });
 * ```
 */
export class ModulesFactory<TPredefinedDeps extends AnyObject = EmptyObject> {
  /**
   * Creates a new module factory.
   *
   * @param config Factory strategy and predefined dependencies.
   *
   * @example
   * ```ts
   * const factory = new ModulesFactory({
   *   factory: (Module, deps) => new Module(deps),
   * });
   * ```
   *
   * @example
   * ```ts
   * const factory = new ModulesFactory({
   *   factory: (Module, deps) => new Module(deps),
   *   deps: { api },
   * });
   * ```
   */
  constructor(private config: ModuleLoaderConfig<TPredefinedDeps>) {}

  /**
   * Creates an instance of the provided class by merging predefined and
   * per-call dependencies.
   *
   * @template TInstance Instance type produced by the constructor.
   * @template TDeps Full dependency object expected by the constructor.
   * @param Constructor Class constructor receiving a single dependency object.
   * @param args Additional dependencies merged over predefined ones.
   * @returns Created class instance.
   *
   * @example
   * ```ts
   * const service = factory.create(UserService, { logger });
   * ```
   *
   * @example
   * ```ts
   * const store = factory.create(UserStore);
   * ```
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
