import type { Maybe } from 'yummies/types';

/**
 * Checks whether the element is nested inside the provided parent element.
 *
 * @example
 * ```ts
 * checkElementHasParent(childElement, modalElement);
 * ```
 */
export const checkElementHasParent = (
  element: HTMLElement | null,
  parent: Maybe<HTMLElement>,
) => {
  let node = element;

  if (!parent) return false;

  while (node != null) {
    if (node === parent) {
      return true;
    } else {
      node = node.parentElement;
    }
  }

  return false;
};
