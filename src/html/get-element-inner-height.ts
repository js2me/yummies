/**
 * Calculates the inner height of an HTML element, accounting for padding.
 */
export function getElementInnerHeight(element: HTMLElement) {
  const { clientHeight } = element;
  const { paddingTop, paddingBottom } = getComputedStyle(element);
  return (
    clientHeight -
    Number.parseFloat(paddingTop) -
    Number.parseFloat(paddingBottom)
  );
}
