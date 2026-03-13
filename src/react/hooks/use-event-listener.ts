/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from 'react';
import { useSyncRef } from './use-sync-ref.js';

/**
 * Subscribes to a DOM event and keeps the latest handler without resubscribing
 * on every render.
 *
 * Supports optional debounce and custom effect dependencies.
 *
 * @template EventName DOM event name from `HTMLElementEventMap`.
 * @param config Event subscription configuration.
 *
 * @example
 * ```ts
 * useEventListener({
 *   event: 'click',
 *   handler: () => console.log('clicked'),
 * });
 * ```
 *
 * @example
 * ```ts
 * useEventListener({
 *   event: 'scroll',
 *   node: window,
 *   debounce: 100,
 *   handler: () => console.log('scroll'),
 * });
 * ```
 */
export const useEventListener = <EventName extends keyof HTMLElementEventMap>({
  event,
  handler,
  options,
  deps = [],
  debounce,
  node = document,
}: {
  event: EventName;
  handler: (e: HTMLElementEventMap[EventName]) => void;
  options?: boolean | AddEventListenerOptions;
  deps?: unknown[];
  debounce?: number;
  node?: HTMLElement | Document | Window;
}) => {
  const handlerRef = useSyncRef(handler);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const handleEvent = (e: HTMLElementEventMap[EventName]) => {
      if (debounce == null) {
        handlerRef.current(e);
      } else {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          handlerRef.current(e);
          timerId = undefined;
        }, debounce);
      }
    };

    // @ts-expect-error
    node.addEventListener(event, handleEvent, options);
    return () => {
      // @ts-expect-error
      node.removeEventListener(event, handleEvent, options);
      clearTimeout(timerId);
    };
  }, deps);
};
