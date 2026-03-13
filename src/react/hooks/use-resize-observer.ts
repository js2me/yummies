import { useLayoutEffect } from 'react';
import { useDefineRef } from './use-define-ref.js';

/**
 * Creates a stable `ResizeObserver` instance and disconnects it on unmount.
 *
 * @param callback Resize observer callback.
 * @returns Ref containing the observer instance.
 *
 * @example
 * ```ts
 * const observerRef = useResizeObserver((entries) => {
 *   console.log(entries[0]?.contentRect.width);
 * });
 * ```
 *
 * @example
 * ```ts
 * const resizeObserver = useResizeObserver(handleResize);
 * resizeObserver.current.observe(element);
 * ```
 */
export const useResizeObserver = (callback: ResizeObserverCallback) => {
  const resizeObserverRef = useDefineRef(() => new ResizeObserver(callback));

  useLayoutEffect(() => {
    return () => {
      resizeObserverRef.current.disconnect();
    };
  }, []);

  return resizeObserverRef;
};
