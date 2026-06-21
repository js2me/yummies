/**
 * Is not recommended to use.
 *
 * Generates execution stack based pseudo-id (just sliced string from error stack)
 */
export const generateStackBasedId = () =>
  new Error().stack!.split('\n').slice(1, 4).join('');
