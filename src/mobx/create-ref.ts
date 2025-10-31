import {
  type IEqualsComparer,
  makeObservable,
  comparer as mobxComparer,
  observable,
  runInAction,
} from 'mobx';
import type { AnyObject, Maybe } from 'yummies/types';

export type RefChangeListener<T> = (value: T | null) => void;

/**
 * Alternative to React.createRef but works in MobX world.
 * Typically it the should be the same React.LegacyRef (fn style)
 */
export interface Ref<T = any, TMeta = AnyObject> {
  (element: Maybe<T>): void;

  listeners: Set<RefChangeListener<NoInfer<T>>>;
  current: NoInfer<T> | null;
  meta: TMeta;
}

export interface CreateRefConfig<T = any, TMeta = AnyObject> {
  onSet?: (node: T) => void;
  onUnset?: () => void;
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
  const comparer = cfg?.comparer ?? mobxComparer.default;

  const ref = ((value: Maybe<T>) => {
    const nextValue = value ?? null;

    if (comparer(ref.current, nextValue)) {
      return;
    }

    runInAction(() => {
      ref.current = nextValue;

      ref.listeners.forEach((listener) => {
        listener(ref.current);
      });
    });
  }) as Ref<T, TMeta>;

  ref.listeners = new Set(cfg?.onChange ? [cfg.onChange] : []);

  if (cfg?.onSet || cfg?.onUnset) {
    ref.listeners.add((value) => {
      if (value) {
        cfg.onSet?.(value);
      } else {
        cfg.onUnset?.();
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
