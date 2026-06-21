import { createLinearNumericIdGenerator } from './create-linear-numeric-id-generator.js';

/**
 *
 * @example
 * ```ts
 * generateLinearNumericId() // '000000000'
 * generateLinearNumericId() // '000000001'
 * ...
 * generateLinearNumericId() // '999999999'
 * generateLinearNumericId() // '1000000000'
 * ...
 * generateLinearNumericId() // '9999999999'
 * generateLinearNumericId() // '10000000000'
 * ```
 *
 */
export const generateLinearNumericId = createLinearNumericIdGenerator();
