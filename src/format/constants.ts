/**
 * Placeholder shown when a formatter cannot produce a meaningful value.
 *
 * @example
 * ```ts
 * const fallback = NO_VALUE;
 * ```
 *
 * @example
 * ```ts
 * format.number(null, { emptyText: NO_VALUE });
 * ```
 */
export const NO_VALUE = '–'; // en-dash

/**
 * Plain ASCII hyphen character.
 *
 * @example
 * ```ts
 * const separator = HYPHEN;
 * ```
 *
 * @example
 * ```ts
 * `foo${HYPHEN}bar`;
 * ```
 */
export const HYPHEN = '-';

/**
 * Infinity symbol used by numeric formatters and UI output.
 *
 * @example
 * ```ts
 * const label = INFINITY;
 * ```
 *
 * @example
 * ```ts
 * `${INFINITY} items`;
 * ```
 */
export const INFINITY = '∞';
