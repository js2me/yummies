import {
  type IEqualsComparer,
  makeObservable,
  comparer as mobxComparer,
  observable,
  runInAction,
} from 'mobx';
import type { AnyObject, Maybe } from 'yummies/utils/types';

export type RefChangeListener<T> = (value: T | null) => void;

/**
 * Alternative to React.createRef but works in MobX world.
 * Typically it the should be the same React.LegacyRef (fn style)
 */
export type Ref<T = any, TMeta = AnyObject> = ((element: Maybe<T>) => void) & {
  listeners: Set<RefChangeListener<T>>;
  current: T | null;
  meta: TMeta;
};

/**
 * Creates ref thing to attach HTMLElements in React and all other
 */
export const createRef = <T = HTMLElement, TMeta = AnyObject>(cfg?: {
  onSet?: (node: T) => void;
  onUnset?: () => void;
  onChange?: RefChangeListener<T>;
  meta?: TMeta;
  initial?: Maybe<T>;
  comparer?: IEqualsComparer<T | null>;
}): Ref<T, TMeta> => {
  const comparer = cfg?.comparer ?? mobxComparer.default;

  const actionFn = ((value: Maybe<T>) => {
    const nextValue = value ?? null;

    if (comparer(actionFn.current, nextValue)) {
      return;
    }

    runInAction(() => {
      actionFn.current = nextValue;

      actionFn.listeners.forEach((listener) => {
        listener(actionFn.current);
      });
    });
  }) as Ref<T, TMeta>;

  actionFn.listeners = new Set(cfg?.onChange ? [cfg.onChange] : []);

  if (cfg?.onSet || cfg?.onUnset) {
    actionFn.listeners.add((value) => {
      if (value) {
        cfg.onSet?.(value);
      } else {
        cfg.onUnset?.();
      }
    });
  }

  actionFn.current = cfg?.initial ?? null;
  actionFn.meta = cfg?.meta ?? ({} as TMeta);

  makeObservable(actionFn, {
    current: observable.ref,
    meta: observable,
  });

  return actionFn;
};

export const isRef = <T, TMeta = AnyObject>(
  value: any,
): value is Ref<T, TMeta> => {
  return typeof value === 'function' && 'current' in value;
};
