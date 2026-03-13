import { useCallback, useState } from 'react';

/**
 * Forces a component re-render by updating an internal dummy state.
 *
 * @returns Stable callback that triggers a re-render.
 *
 * @example
 * ```ts
 * const forceUpdate = useForceUpdate();
 * forceUpdate();
 * ```
 *
 * @example
 * ```ts
 * const rerender = useForceUpdate();
 * setTimeout(rerender, 1000);
 * ```
 */
export const useForceUpdate = () => {
  const [, setState] = useState<unknown>(null);

  return useCallback(() => {
    setState({});
  }, []);
};
