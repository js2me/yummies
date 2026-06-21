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
