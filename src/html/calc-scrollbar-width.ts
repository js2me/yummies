/**
 * Calculates the scrollbar width.
 */
export const calcScrollbarWidth = (elementToAppend = document.body) => {
  const outer = document.createElement('div');

  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.overflow = 'scroll';

  elementToAppend.append(outer);

  const inner = document.createElement('div');
  inner.style.width = '100%';

  outer.append(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};
