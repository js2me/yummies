/**
 * Removes all whitespace characters from a string.
 *
 * @param value Source string.
 * @returns String without spaces, tabs and line breaks.
 *
 * @example
 * ```ts
 * skipSpaces('1 000 000'); // '1000000'
 * ```
 *
 * @example
 * ```ts
 * skipSpaces('a\tb\nc'); // 'abc'
 * ```
 */
export const skipSpaces = (value: string) => value.replaceAll(/\s/g, '');
