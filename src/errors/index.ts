/**
 * ---header-docs-section---
 * # yummies/errors
 *
 * ## Description
 *
 * Turns thrown values, `Error` objects, and unknown API failures into a single human-readable string
 * for toasts, forms, and logs. The default `getErrorText` can be extended with custom formatters and
 * enhancers so domain-specific errors still map to stable copy without try/catch boilerplate.
 *
 * ## Usage
 *
 * ```ts
 * import { getErrorText } from "yummies/errors";
 * ```
 */

export * from './get-error-text.js';
