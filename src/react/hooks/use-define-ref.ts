import { type MutableRefObject, useRef } from 'react';

/**
 * Creates a mutable ref whose value is initialized exactly once.
 *
 * @template T Ref value type.
 * @param defineFn Function that lazily creates the initial ref value.
 * @returns Mutable ref with a stable initialized value.
 *
 * @example
 * ```ts
 * const cacheRef = useDefineRef(() => new Map());
 * ```
 *
 * @example
 * ```ts
 * const observerRef = useDefineRef(() => new ResizeObserver(() => {}));
 * ```
 */
export const useDefineRef = <T>(defineFn: () => T): MutableRefObject<T> => {
  const ref = useRef<T>(void 0 as T);

  if (!ref.current) {
    ref.current = defineFn();
  }

  return ref;
};
