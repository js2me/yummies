/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from 'react';
import { useSyncRef } from './use-sync-ref.js';

export const useEventListener = <EventName extends keyof HTMLElementEventMap>({
  event,
  handler,
  options,
  deps = [],
  node = document,
}: {
  event: EventName;
  handler: (e: HTMLElementEventMap[EventName]) => void;
  options?: boolean | AddEventListenerOptions;
  deps?: unknown[];
  node?: HTMLElement | Document | Window;
}) => {
  const handlerRef = useSyncRef(handler);

  useEffect(() => {
    const handleEvent = (e: HTMLElementEventMap[EventName]) =>
      handlerRef.current(e);

    // @ts-expect-error
    node.addEventListener(event, handleEvent, options);
    // @ts-expect-error
    return () => node.removeEventListener(event, handleEvent, options);
  }, deps);
};
