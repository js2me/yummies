import { useEffect } from 'react';

import { useConstant } from './use-constant.js';

/**
 * Creates a single `AbortController` instance for the component lifetime.
 *
 * The controller is aborted automatically during unmount.
 *
 * @returns Stable abort controller instance.
 *
 * @example
 * ```ts
 * const controller = useAbortController();
 * fetch('/api', { signal: controller.signal });
 * ```
 *
 * @example
 * ```ts
 * const controller = useAbortController();
 * controller.abort();
 * ```
 */
export const useAbortController = () => {
  const controller = useConstant(() => new AbortController());

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return controller;
};
