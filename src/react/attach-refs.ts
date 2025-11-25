import type { Ref, RefObject } from 'react';

export const attachRefs = <T>(
  value: T | null,
  ...refs: (RefObject<T> | RefObject<T | null> | Ref<T>)[]
) =>
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      // @ts-expect-error
      ref.current = value;
    }
  });
