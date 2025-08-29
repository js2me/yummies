import { useLayoutEffect, useRef } from 'react';

export const useElementRef = <T extends HTMLElement>(selector: () => T) => {
  const ref = useRef<T>();

  useLayoutEffect(() => {
    ref.current = selector();
  }, []);

  return ref;
};
