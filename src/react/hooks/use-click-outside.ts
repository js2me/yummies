import type { MutableRefObject } from 'react';
import { useEventListener } from './use-event-listener.js';

type ClickOutsideInput = {
  contentRef: MutableRefObject<HTMLElement | null>;
  onClick: VoidFunction;
  options?: AddEventListenerOptions;
};

export const useClickOutside = ({
  contentRef,
  onClick,
  options,
}: ClickOutsideInput) => {
  useEventListener({
    event: 'mousedown',
    handler: (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        onClick();
      }
    },
    options,
  });
};
