/**
 * @internal Separate chunk so DOMPurify is tree-shaken away when `sanitizeHtml` is not used.
 * Consumers import from `yummies/html` — this module is not a public entry point.
 */

import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';
import type { Maybe } from 'yummies/types';

type SanitizeHtmlFn = ((
  html: Maybe<string>,
  config?: DOMPurifyConfig,
) => string) & {
  /**
   * Default DOMPurify settings
   */
  defaults: DOMPurifyConfig;
};
/**
 * Sanitizes HTML using the default allowlist merged with custom DOMPurify config.
 *
 * Default DOMPurify settings are exposed on `sanitizeHtml.defaults` and can be
 * overridden per call via `config`.
 *
 * @example
 * ```ts
 * sanitizeHtml('<img src=x onerror=alert(1) />');
 * ```
 */
export const sanitizeHtml = ((
  html: Maybe<string>,
  config?: DOMPurifyConfig,
) => {
  return DOMPurify.sanitize(html || '', {
    ...sanitizeHtml.defaults,
    ...config,
  });
}) as SanitizeHtmlFn;

sanitizeHtml.defaults = {
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
