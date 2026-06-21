/**
 * Returns `true` if `url` starts with `https://` or `http://` (case-sensitive, as in
 * `String#startsWith`). Does not validate that the rest is a well-formed URL — only the scheme
 * prefix. `blob:`, `data:`, and relative paths return `false`.
 *
 * @param url - String to test (often a user-provided or configured href).
 *
 * @example
 * ```ts
 * isHttpUrl('https://example.com/path'); // true
 * isHttpUrl('http://localhost:3000'); // true
 * ```
 *
 * @example
 * ```ts
 * isHttpUrl('//cdn.example.com'); // false — no explicit http(s) prefix
 * isHttpUrl('/assets/logo.png'); // false — relative path
 * ```
 */
export const isHttpUrl = (url: string): boolean => {
  return url.startsWith('https://') || url.startsWith('http://');
};
