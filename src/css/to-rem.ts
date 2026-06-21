/**
 * Converts a length in **pixels** to a CSS **`rem`** string (`"<number>rem"`).
 *
 * Use when authoring component styles in JS/TS where design tokens are in px but the stylesheet
 * should scale with root font size (accessibility, user zoom). `remValue` is the assumed
 * `1rem` size in px (browser default is typically `16`).
 *
 * Also you can override default rem value using `toRem.defaultRemValue = 24`
 *
 * @param px - Pixel value to convert (not rounded; stringification keeps full float).
 * @param remValue - How many pixels one `rem` equals. Defaults to `16`.
 * @returns A string like `"1.5rem"` suitable for `style` or CSS-in-JS.
 *
 * @example
 * ```ts
 * const width = toRem(24); // '1.5rem' with default 16px root
 * ```
 *
 * @example
 * ```ts
 * // Custom root / design system where 1rem === 10px
 * const gap = toRem(20, 10); // '2rem'
 * ```
 */
export const toRem = (px: number, remValue?: number): string =>
  `${px / (remValue ?? toRem.defaultRemValue)}rem`;

toRem.defaultRemValue = 16;
