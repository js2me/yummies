/**
 * Scrolls the page vertically to the viewport section containing the target element.
 *
 * @example
 * ```ts
 * globalScrollIntoViewForY(document.getElementById('footer')!);
 * ```
 */
export const globalScrollIntoViewForY = (node: HTMLElement) => {
  const scrollContainer = document.body;
  const pageHeight = window.innerHeight;
  const nodeBounding = node.getBoundingClientRect();
  const scrollPagesCount = scrollContainer.scrollHeight / pageHeight;

  const scrollPageNumber = Math.min(
    Math.max(nodeBounding.top / pageHeight, 1),
    scrollPagesCount,
  );

  window.scroll({
    top: scrollPageNumber * pageHeight,
    behavior: 'smooth',
  });
};
