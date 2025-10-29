import { action, makeObservable, observable } from 'mobx';
import type { AnyObject, Maybe } from 'yummies/utils/types';

/**
 * Alternative to React.createRef but works in MobX world.
 * Typically it the should be the same React.LegacyRef (fn style)
 */
export type Ref<T = any, TMeta = AnyObject> = ((element: Maybe<T>) => void) & {
  current: T | null;
  meta: TMeta;
};

/**
 * Creates ref thing to attach HTMLElements in React and all other
 */
export const createRef = <T = HTMLElement, TMeta = AnyObject>(cfg?: {
  onSet?: (node: T) => void;
  onUnset?: () => void;
  meta?: TMeta;
}): Ref<T, TMeta> => {
  const actionFn = action((value: T | null) => {
    actionFn.current = value;
    if (actionFn.current) {
      cfg?.onSet?.(actionFn.current);
    } else {
      cfg?.onUnset?.();
    }
  }) as Ref<T, TMeta>;

  actionFn.current = null;
  actionFn.meta = cfg?.meta ?? ({} as TMeta);

  makeObservable(actionFn, {
    current: observable.ref,
    meta: observable,
  });

  return actionFn;
};

export const isRef = <T>(value: any): value is Ref<T> => {
  return typeof value === 'function' && 'current' in value;
};
