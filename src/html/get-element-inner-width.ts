/**
 * Calculates the inner width of an HTML element, accounting for padding.
 */
export function getElementInnerWidth(el: HTMLElement) {
  const { clientWidth } = el;
  const { paddingLeft, paddingRight } = getComputedStyle(el);
  return (
    clientWidth -
    Number.parseFloat(paddingLeft) -
    Number.parseFloat(paddingRight)
  );
}
