import { useRef } from 'react';

/**
 * Remembers and returns the last non-nullish value passed to the hook.
 *
 * @template T Value type.
 * @param value Current value that may be `null` or `undefined`.
 * @returns Current value when defined, otherwise the previous defined value.
 *
 * @example
 * ```ts
 * const title = useLastDefinedValue(props.title);
 * ```
 *
 * @example
 * ```ts
 * const user = useLastDefinedValue<User | null>(selectedUser);
 * ```
 */
export const useLastDefinedValue = <T>(value: T) => {
  const ref = useRef(value);
  if (value != null) {
    ref.current = value;
  }
  return ref.current;
};
