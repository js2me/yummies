import type { LegacyRef, RefObject } from 'react';
import type { Maybe } from 'yummies/types';

/**
 * Assigns the same value to multiple React refs, including callback refs.
 *
 * @template T Referenced value type.
 * @param value Value that should be written into every provided ref.
 * @param refs Target refs to update.
 *
 * @example
 * ```ts
 * attachRefs(node, localRef, forwardedRef);
 * ```
 *
 * @example
 * ```ts
 * attachRefs(null, inputRef, (value) => console.log(value));
 * ```
 */
export const attachRefs = <T>(
  value: T | null,
  ...refs: Maybe<RefObject<T> | RefObject<T | null> | LegacyRef<T>>[]
) =>
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref && typeof ref !== 'string') {
      // @ts-expect-error
      ref.current = value;
    }
  });
