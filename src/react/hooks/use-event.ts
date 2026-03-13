/**
 * Creates an event callback with a stable function identity and up-to-date logic.
 *
 * Borrowed from the `useEvent` RFC idea by React contributors.
 *
 * @template H Handler function type.
 * @param handler Latest callback implementation.
 * @returns Stable callback that always delegates to the latest handler.
 *
 * @example
 * ```ts
 * const onClick = useEvent(() => {
 *   console.log('clicked');
 * });
 * ```
 *
 * @example
 * ```ts
 * const onSubmit = useEvent((value: string) => save(value));
 * ```
 */
import { useCallback, useLayoutEffect, useRef } from 'react';
import type { AnyFunction } from 'yummies/types';

export const useEvent = <H extends AnyFunction>(handler: H): H => {
  const handlerRef = useRef<H>(handler);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: unknown[]) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current as AnyFunction;
    return fn(...args);
  }, []) as unknown as H;
};
