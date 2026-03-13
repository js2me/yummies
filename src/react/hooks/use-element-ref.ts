import { useLayoutEffect, useRef } from 'react';

/**
 * Resolves an element once after mount and stores it in a ref.
 *
 * @template T Element type.
 * @param selector Function returning the target element.
 * @returns Ref containing the selected element.
 *
 * @example
 * ```ts
 * const buttonRef = useElementRef(() => document.getElementById('save') as HTMLButtonElement);
 * ```
 *
 * @example
 * ```ts
 * const modalRef = useElementRef(() => document.querySelector('.modal') as HTMLDivElement);
 * ```
 */
export const useElementRef = <T extends HTMLElement>(selector: () => T) => {
  const ref = useRef<T>();

  useLayoutEffect(() => {
    ref.current = selector();
  }, []);

  return ref;
};
