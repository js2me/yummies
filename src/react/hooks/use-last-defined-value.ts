import { useRef } from 'react';

export const useLastDefinedValue = <T>(value: T) => {
  const ref = useRef(value);
  if (value != null) {
    ref.current = value;
  }
  return ref.current;
};
