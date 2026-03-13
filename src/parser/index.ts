// This way is more treeshakable than collecting
// it into one exportable object export const parser
import * as parser from './_exports.js';

/**
 * Namespace-like aggregate export for parser helpers.
 *
 * @example
 * ```ts
 * parser.number('42');
 * ```
 *
 * @example
 * ```ts
 * parser.string({ ok: true });
 * ```
 */
export { parser };
