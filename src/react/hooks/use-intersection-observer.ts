import { useEffect, useState } from 'react';

/**
 * Creates a single `IntersectionObserver` instance and disposes it on unmount.
 *
 * @param callback Observer callback invoked for intersection changes.
 * @param options Optional observer configuration.
 * @returns Stable `IntersectionObserver` instance.
 *
 * @example
 * ```ts
 * const observer = useIntersectionObserver((entries) => {
 *   console.log(entries[0]?.isIntersecting);
 * });
 * ```
 *
 * @example
 * ```ts
 * const observer = useIntersectionObserver(handleIntersect, { threshold: 0.5 });
 * observer.observe(element);
 * ```
 */
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => {
  const [intersectionObserver] = useState(
    () => new IntersectionObserver(callback, options),
  );

  useEffect(() => {
    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  return intersectionObserver;
};
