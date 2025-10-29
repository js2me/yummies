import { action, makeObservable, observable } from 'mobx';
import type { AnyObject, Maybe } from 'yummies/utils/types';

export type RefChangeListener<T> = (value: T | null) => void;

/**
 * Alternative to React.createRef but works in MobX world.
 * Typically it the should be the same React.LegacyRef (fn style)
 */
export type Ref<T = any, TMeta = AnyObject> = ((element: Maybe<T>) => void) & {
  listeners: RefChangeListener<T>[];
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
}): Ref<T, TMeta> => {
  const actionFn = action((value: Maybe<T>) => {
    actionFn.current = value ?? null;

    actionFn.listeners.forEach((listener) => {
      listener(actionFn.current);
    });
  }) as Ref<T, TMeta>;

  actionFn.listeners = cfg?.onChange ? [cfg.onChange] : [];

  if (cfg?.onSet || cfg?.onUnset) {
    actionFn.listeners.push((value) => {
      if (value) {
        cfg.onSet?.(value);
      } else {
        cfg.onUnset?.();
      }
    });
  }

  actionFn.current = null;
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
