import { useEffect, useRef, useState } from 'react';

/**
 * Captures an element's height the first time its ref becomes available.
 *
 * @template T Element type attached to the returned ref.
 * @returns Ref and the initial measured height.
 *
 * @example
 * ```ts
 * const { ref, initialHeight } = useInitialHeight<HTMLDivElement>();
 * ```
 *
 * @example
 * ```ts
 * const state = useInitialHeight<HTMLTextAreaElement>();
 * state.initialHeight;
 * ```
 */
export const useInitialHeight = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [initialHeight, setInitialHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (ref.current && !initialHeight) {
      setInitialHeight(ref.current.offsetHeight);
    }
  }, [initialHeight]);

  return { ref, initialHeight };
};
