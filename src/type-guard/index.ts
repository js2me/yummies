// This way is more treeshakable than collecting
// it into one exportable object export const typeGuard
import * as typeGuard from './_exports.js';

/**
 * Namespace-like aggregate export for type guard helpers.
 *
 * @example
 * ```ts
 * typeGuard.isString('hello');
 * ```
 *
 * @example
 * ```ts
 * typeGuard.isNumber(42);
 * ```
 */
export { typeGuard };
