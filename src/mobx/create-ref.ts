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
 * Creates ref thing to attach HTMLElements in React and all other
 */
export const createRef = <T = any, TMeta = AnyObject>(
  cfg?: CreateRefConfig<T, TMeta>,
): Ref<T, TMeta> => {
  let lastValue: T | undefined;
  const comparer = cfg?.comparer ?? mobxComparer.default;

  const ref = ((value: Maybe<T>) => {
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
  }) as Ref<T, TMeta>;

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

export const isRef = <T, TMeta = any>(
  value: T | Ref<T, TMeta>,
): value is Ref<T, TMeta> => {
  return typeof value === 'function' && 'current' in value;
};

export const toRef = <T, TMeta = any>(
  value: T | Ref<T, TMeta>,
  cfg?: Omit<CreateRefConfig<T, TMeta>, 'initial'>,
): Ref<T, TMeta> => {
  return isRef(value) ? value : createRef({ initial: value, ...cfg });
};
