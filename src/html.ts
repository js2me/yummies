import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';
import { blobToUrl } from 'yummies/media';
import type { Maybe } from 'yummies/types';

/**
 * Extracts an RGB value from any valid CSS color.
 *
 * Not recommended for frequent use because it triggers a reflow.
 */
export const getComputedColor = (color?: string): string | null => {
  if (!color) return null;

  const d = document.createElement('div');
  d.style.color = color;
  document.body.append(d);
  const rgbcolor = globalThis.getComputedStyle(d).color;
  const match =
    /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.d+]*)*\)/g.exec(rgbcolor);

  d.remove();

  if (!match) return null;

  return `${match[1]}, ${match[2]}, ${match[3]}`;
};

/**
 * Triggers a file download by creating and clicking a temporary anchor element.
 *
 * @example
 * ```ts
 * downloadUsingAnchor('/report.pdf', 'report.pdf');
 * ```
 */
export const downloadUsingAnchor = (
  urlOrBlob: string | Blob,
  fileName?: string,
) => {
  const url = blobToUrl(urlOrBlob);

  const a = document.createElement('a');
  a.href = url;

  a.download = fileName ?? 'file';

  a.target = '_blank';

  document.body.append(a);

  a.click();

  a.remove();
};

/**
 * Surrounds string in an anchor tag
 */
export function wrapTextToTagLink(link: string) {
  const descr = String(link).replace(/^(https?:\/{0,2})?(w{3}\.)?/, 'www.');
  if (!/^https?:\/{2}/.test(link)) link = `http://${link}`;
  return `<a href=${link} target="_blank">${descr}</a>`;
}

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

/**
 * Prevents the default browser action and stops event propagation.
 *
 * @example
 * ```ts
 * button.addEventListener('click', (event) => skipEvent(event));
 * ```
 */
export const skipEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();

  return false;
};

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

const sanitizeDefaults: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'a',
    'article',
    'b',
    'blockquote',
    'br',
    'caption',
    'code',
    'del',
    'details',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'ins',
    'kbd',
    'li',
    'main',
    'ol',
    'p',
    'pre',
    'section',
    'span',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
  ALLOWED_ATTR: ['href', 'target', 'name', 'src', 'class'],
};

/**
 * Sanitizes HTML using the default allowlist merged with custom DOMPurify config.
 *
 * @example
 * ```ts
 * sanitizeHtml('<img src=x onerror=alert(1) />');
 * ```
 */
export const sanitizeHtml = (html: Maybe<string>, config?: DOMPurifyConfig) => {
  return DOMPurify.sanitize(html || '', {
    ...sanitizeDefaults,
    ...config,
  });
};

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

/**
 * Executes a function within a view transition if supported by the browser.
 *
 * @param {VoidFunction} fn - The function to be executed.
 * @returns {ViewTransition} - The result of the executed function.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition | MDN: Document.startViewTransition}
 */
export const startViewTransitionSafety = (
  fn: VoidFunction,
  params?: { disabled?: boolean },
) => {
  if (
    typeof document !== 'undefined' &&
    document.startViewTransition &&
    !params?.disabled
  ) {
    return document.startViewTransition(fn);
  }
  fn();
};

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

/**
 * Checks whether the user prefers a dark color scheme.
 *
 * @example
 * ```ts
 * const prefersDark = isPrefersDarkTheme();
 * ```
 */
export const isPrefersDarkTheme = () =>
  !!globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

/**
 * Checks whether the user prefers a light color scheme.
 *
 * @example
 * ```ts
 * const prefersLight = isPrefersLightTheme();
 * ```
 */
export const isPrefersLightTheme = () =>
  !!globalThis.matchMedia?.('(prefers-color-scheme: light)')?.matches;
