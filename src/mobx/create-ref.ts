import {
  type IEqualsComparer,
  makeObservable,
  comparer as mobxComparer,
  observable,
  runInAction,
} from 'mobx';
import type { AnyObject, Maybe } from 'yummies/types';

/**
 * You can return `false` if you don't want to change the value in this ref
 */
export type RefChangeListener<T> = (
  value: T | null,
  prevValue: T | undefined,
) => void | false;

/**
 * Alternative to React.createRef but works in MobX world.
 * Typically it the should be the same React.LegacyRef (fn style)
 */
export interface Ref<T = any, TMeta = AnyObject> {
  /**
   * Setter function
   */
  (value: Maybe<T>): void;

  set(value: Maybe<T>): void;
  listeners: Set<RefChangeListener<NoInfer<T>>>;
  current: NoInfer<T> | null;
  meta: TMeta;
}

export interface CreateRefConfig<T = any, TMeta = AnyObject> {
  onSet?: (node: T, prevValue: T | undefined) => void;
  onUnset?: (lastValue: T | undefined) => void;
  onChange?: RefChangeListener<T>;
  meta?: TMeta;
  initial?: Maybe<T>;
  comparer?: IEqualsComparer<T | null>;
}

/**
 * Creates a MobX-aware ref that behaves like a callback ref and exposes
 * observable `current` and `meta` fields.
 *
 * @template T Referenced value type.
 * @template TMeta Additional observable metadata stored on the ref.
 * @param cfg Optional callbacks, initial value and comparer configuration.
 * @returns Observable ref function object.
 *
 * @example
 * ```ts
 * const inputRef = createRef<HTMLInputElement>();
 * inputRef.set(document.createElement('input'));
 * ```
 *
 * @example
 * ```ts
 * const ref = createRef<number>();
 * ref(3);
 * ref.current; // 3
 * ```
 *
 * @example
 * ```ts
 * const nodeRef = createRef({
 *   onUnset: () => console.log('detached'),
 *   meta: { mounted: false },
 * });
 * ```
 */
export const createRef = <T = any, TMeta = AnyObject>(
  cfg?: CreateRefConfig<T, TMeta>,
): Ref<T, TMeta> => {
  let lastValue: T | undefined;
  const comparer = cfg?.comparer ?? mobxComparer.default;

  const setValue: Ref<T, TMeta>['set'] = (value) => {
    const nextValue = value ?? null;

    if (comparer(ref.current, nextValue)) {
      return;
    }

    runInAction(() => {
      const prevLastValue = lastValue;
      lastValue = ref.current ?? undefined;
      ref.current = nextValue;

      let isNextValueIgnored = false;

      ref.listeners.forEach((listener) => {
        const listenerResult = listener(ref.current, lastValue);

        if (listenerResult === false) {
          isNextValueIgnored = true;
        }
      });

      if (isNextValueIgnored) {
        lastValue = prevLastValue;
        ref.current = lastValue ?? null;
      } else if (ref.current === null && lastValue !== undefined) {
        lastValue = undefined;
      }
    });
  };

  const ref = setValue as Ref<T, TMeta>;

  ref.set = setValue;

  ref.listeners = new Set(cfg?.onChange ? [cfg.onChange] : []);

  if (cfg?.onSet || cfg?.onUnset) {
    ref.listeners.add((value, prevValue) => {
      if (value) {
        cfg.onSet?.(value, prevValue);
      } else {
        cfg.onUnset?.(prevValue);
      }
    });
  }

  ref.current = cfg?.initial ?? null;
  ref.meta = cfg?.meta ?? ({} as TMeta);

  makeObservable(ref, {
    current: observable.ref,
    meta: observable,
  });

  return ref;
};

/**
 * Checks whether the provided value is a ref created by `createRef`.
 *
 * @template T Referenced value type.
 * @template TMeta Ref metadata type.
 * @param value Value to inspect.
 * @returns `true` when the value is a ref-like function with `current`.
 *
 * @example
 * ```ts
 * const ref = createRef<number>();
 * isRef(ref); // true
 * ```
 *
 * @example
 * ```ts
 * isRef({ current: 1 }); // false
 * ```
 */
export const isRef = <T, TMeta = any>(
  value: T | Ref<T, TMeta>,
): value is Ref<T, TMeta> => {
  return typeof value === 'function' && 'current' in value;
};

/**
 * Normalizes a plain value or an existing ref into a `Ref` instance.
 *
 * @template T Referenced value type.
 * @template TMeta Ref metadata type.
 * @param value Existing ref or initial plain value.
 * @param cfg Optional ref configuration applied when a new ref is created.
 * @returns Existing ref or a newly created ref initialized with `value`.
 *
 * @example
 * ```ts
 * const ref = toRef(document.body);
 * ref.current === document.body;
 * ```
 *
 * @example
 * ```ts
 * const existingRef = createRef<number>();
 * const sameRef = toRef(existingRef);
 * ```
 */
export const toRef = <T, TMeta = any>(
  value: T | Ref<T, TMeta>,
  cfg?: Omit<CreateRefConfig<T, TMeta>, 'initial'>,
): Ref<T, TMeta> => {
  return isRef(value) ? value : createRef({ initial: value, ...cfg });
};
