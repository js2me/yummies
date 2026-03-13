// This way is more treeshakable than collecting
// it into one exportable object export const format
import * as format from './_exports.js';

/**
 * Namespace-like aggregate export for all formatting helpers.
 *
 * @example
 * ```ts
 * format.number(1500);
 * ```
 *
 * @example
 * ```ts
 * format.skipSpaces('a b c');
 * ```
 */
export { format };
