import { useAbortController } from './use-abort-controller.js';

/**
 * Returns an `AbortSignal` tied to the component lifecycle.
 *
 * The signal is aborted automatically on unmount.
 *
 * @returns Lifecycle-bound abort signal.
 *
 * @example
 * ```ts
 * const signal = useAbortSignal();
 * fetch('/api/users', { signal });
 * ```
 *
 * @example
 * ```ts
 * const signal = useAbortSignal();
 * someAsyncTask({ signal });
 * ```
 */
export const useAbortSignal = () => {
  return useAbortController().signal;
};
