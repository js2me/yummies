import type { Maybe } from 'yummies/types';

/**
 * Injects a stylesheet by appending a `<link rel="stylesheet">` to `document.head`.
 * Resolves when the sheet fires `load`; rejects on `error` (e.g. 404 or network failure).
 *
 * **Id replacement:** if `attrubutes.id` is set, any existing element with that `id` is removed
 * first, so repeated calls with the same `id` replace the previous link (useful for theme or
 * font URLs that change).
 *
 * If `rel` is omitted in `attrubutes`, it defaults to `stylesheet`. Other attributes (`crossorigin`,
 * `media`, `data-*`, etc.) are set via `setAttribute` from the record entries.
 *
 * @param url - Stylesheet URL (`href`).
 * @param attrubutes - Optional HTML attributes for the `<link>` element (see `id` / `rel` behavior above).
 * @returns Promise that resolves to `undefined` on load, or rejects on load error.
 *
 * @example
 * ```ts
 * await loadCssFile('https://example.com/fonts.css', {
 *   id: 'app-fonts',
 *   crossOrigin: 'anonymous',
 * });
 * ```
 *
 * @example
 * ```ts
 * // Swap theme stylesheet without duplicate link tags
 * await loadCssFile('/themes/dark.css', { id: 'theme' });
 * await loadCssFile('/themes/light.css', { id: 'theme' });
 * ```
 */
export const loadCssFile = (url: string, attrubutes?: Record<string, any>) =>
  new Promise((resolve, reject) => {
    let link: Maybe<HTMLLinkElement>;

    if (attrubutes?.id) {
      link = document.getElementById(attrubutes.id) as HTMLLinkElement | null;

      if (link) {
        link.remove();
      }
    }

    link = document.createElement('link');

    const handleLoad = () => {
      resolve(undefined);
      link!.removeEventListener('load', handleLoad);
      link!.removeEventListener('error', handleError);
    };

    const handleError = () => {
      reject(undefined);
      link!.removeEventListener('load', handleLoad);
      link!.removeEventListener('error', handleError);
    };

    link.addEventListener('load', handleLoad);
    link.addEventListener('error', handleError);

    link.setAttribute('href', url);

    if (!attrubutes?.rel) {
      link.setAttribute('rel', 'stylesheet');
    }

    Object.entries(attrubutes || {}).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });

    document.head.appendChild(link);
  });
