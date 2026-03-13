import { useRef } from 'react';

/**
 * React hook for creating a value exactly once.
 *
 * Unlike `useMemo`, this guarantees that the initializer is executed only once
 * for the component lifetime.
 *
 * @template T Value type.
 * @param defineValue Function that lazily creates the value.
 * @returns Stable value created on the first render.
 *
 * @example
 * ```ts
 * const id = useConstant(() => crypto.randomUUID());
 * ```
 *
 * @example
 * ```ts
 * const formatter = useConstant(() => new Intl.NumberFormat('en-US'));
 * ```
 */
export const useConstant = <T>(defineValue: () => T): T => {
  const ref = useRef<{ value: T }>();

  if (!ref.current) {
    ref.current = { value: defineValue() };
  }

  return ref.current.value;
};
