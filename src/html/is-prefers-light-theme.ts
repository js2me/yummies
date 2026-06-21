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
