import type { LegacyRef, RefObject } from 'react';
import type { Maybe } from 'yummies/types';

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
