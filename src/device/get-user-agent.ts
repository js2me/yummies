/**
 * Returns the normalized user agent string in lowercase.
 *
 * @example
 * ```ts
 * const userAgent = getUserAgent();
 * ```
 */
export const getUserAgent = () =>
  (
    navigator.userAgent ||
    navigator.vendor ||
    // @ts-expect-error skip opera
    globalThis.opera ||
    ''
  ).toLowerCase();
