import type { MutableRefObject } from 'react';
import { useEventListener } from './use-event-listener.js';

type ClickOutsideInput = {
  contentRef: MutableRefObject<HTMLElement | null>;
  onClick: VoidFunction;
  options?: AddEventListenerOptions;
};

/**
 * Calls a handler when a pointer interaction happens outside the referenced element.
 *
 * @param input Target element ref, callback and event listener options.
 *
 * @example
 * ```ts
 * useClickOutside({
 *   contentRef: modalRef,
 *   onClick: () => closeModal(),
 * });
 * ```
 *
 * @example
 * ```ts
 * useClickOutside({
 *   contentRef: dropdownRef,
 *   onClick: hideDropdown,
 *   options: { capture: true },
 * });
 * ```
 */
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
