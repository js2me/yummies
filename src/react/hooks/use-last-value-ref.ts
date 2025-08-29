import { useRef } from 'react';

export const useLastValueRef = <T>(value: T | null | undefined) => {
  const ref = useRef(value);

  if (value != null) {
    ref.current = value;
  }

  return ref;
};
