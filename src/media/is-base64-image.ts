import { decodeDataUrl } from './decode-data-url.js';

/**
 * Returns `true` when `str` is a data URL that {@link decodeDataUrl} can parse **and** the MIME
 * type starts with `image/` (e.g. `image/png`, `image/jpeg`). Requires both a non-empty Base64
 * payload and an image MIME — arbitrary `data:text/plain;base64,...` is `false`.
 *
 * @param str - Candidate string (often `img.src` or API payload).
 *
 * @example
 * ```ts
 * isBase64Image('data:image/png;base64,iVBORw0KGgo='); // true
 * ```
 *
 * @example
 * ```ts
 * isBase64Image('https://example.com/x.png'); // false
 * isBase64Image('data:text/plain;base64,SGk='); // false
 * ```
 */
export const isBase64Image = (str: string): boolean => {
  const { mimeType, data } = decodeDataUrl(str);
  return !!(data && mimeType?.startsWith('image/'));
};
