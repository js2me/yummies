import { type MutableRefObject, useRef } from 'react';

/**
 * React hook for creating a value exactly once.
 * useMemo doesn't give this guarantee unfortunately -
 * https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
 * https://reactjs.org/docs/hooks-reference.html#usememo
 * @param defineFn Function which returns defined value.
 */
export const useDefineRef = <T>(defineFn: () => T): MutableRefObject<T> => {
  const ref = useRef<T>(void 0 as T);

  if (!ref.current) {
    ref.current = defineFn();
  }

  return ref;
};
