/**
 * Collects the cumulative `offsetTop` value through the element parent chain.
 *
 * @example
 * ```ts
 * const offsetTop = collectOffsetTop(document.getElementById('section'));
 * ```
 */
export const collectOffsetTop = (element: HTMLElement | null) => {
  let offsetTop = 0;
  let node = element;

  while (node != null) {
    offsetTop += node.offsetTop;
    node = node.parentElement;
  }

  return offsetTop;
};
