import { useRef } from 'react';

/**
 * Returns a ref whose `current` value is synchronized with the latest input
 * on every render.
 *
 * @template T Value type.
 * @param value Current value to expose through the ref.
 * @returns Ref containing the latest value.
 *
 * @example
 * ```ts
 * const latestHandler = useSyncRef(onSubmit);
 * latestHandler.current();
 * ```
 *
 * @example
 * ```ts
 * const latestValue = useSyncRef(props.value);
 * latestValue.current;
 * ```
 */
export const useSyncRef = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
