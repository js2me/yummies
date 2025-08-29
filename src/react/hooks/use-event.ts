/**
 * A Hook to define an event handler with an always-stable function identity.
 *
 * borrowed from @gaeron
 * https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
import { useCallback, useLayoutEffect, useRef } from 'react';
import type { AnyFunction } from '../../utils/types.js';

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
