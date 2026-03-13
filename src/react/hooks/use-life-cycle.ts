import { useEffect } from 'react';
import { useSyncRef } from './use-sync-ref.js';

/**
 * Runs mount and unmount callbacks returned by a factory function.
 *
 * The latest factory is stored in a ref, while the effect itself is only
 * subscribed once.
 *
 * @param fn Factory returning optional `mount` and `unmount` handlers.
 *
 * @example
 * ```ts
 * useLifeCycle(() => ({
 *   mount: () => console.log('mounted'),
 *   unmount: () => console.log('unmounted'),
 * }));
 * ```
 *
 * @example
 * ```ts
 * useLifeCycle(() => ({
 *   mount: subscribe,
 *   unmount: unsubscribe,
 * }));
 * ```
 */
export const useLifeCycle = (
  fn: () => {
    mount?: VoidFunction;
    unmount?: VoidFunction;
  },
) => {
  const fnRef = useSyncRef(fn);

  useEffect(() => {
    const fnOperation = fnRef.current();
    fnOperation.mount?.();
    return fnOperation.unmount?.();
  }, []);
};
