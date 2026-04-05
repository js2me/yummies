// This way is more treeshakable than collecting
// it into one exportable object export const assert
import * as assert from './_exports.js';

/**
 * Namespace-like aggregate export for runtime assertions.
 *
 * @example
 * ```ts
 * assert.ok(user.id, "user id is required");
 * ```
 *
 * @example
 * ```ts
 * assert.defined(maybeName);
 * ```
 */
export { assert };
