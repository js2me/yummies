import { useRef } from 'react';

/**
 * Returns a ref that always points to the last non-nullish value.
 *
 * @template T Value type.
 * @param value Current value that may temporarily become `null` or `undefined`.
 * @returns Ref containing the last defined value.
 *
 * @example
 * ```ts
 * const latestUserRef = useLastValueRef(user);
 * latestUserRef.current;
 * ```
 *
 * @example
 * ```ts
 * const latestNodeRef = useLastValueRef<HTMLDivElement | null>(node);
 * ```
 */
export const useLastValueRef = <T>(value: T | null | undefined) => {
  const ref = useRef(value);

  if (value != null) {
    ref.current = value;
  }

  return ref;
};
