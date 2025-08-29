import { useRef } from 'react';

export const useSyncRef = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
