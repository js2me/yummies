import { useEffect } from 'react';
import { useSyncRef } from './use-sync-ref.js';

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
