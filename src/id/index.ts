/**
 * ---header-docs-section---
 * # yummies/id
 *
 * ## Description
 *
 * Fast, URL-friendly identifiers based on **nanoid** with curated alphabets and lengths. Use for
 * client-generated keys, trace ids, or UI instance ids where UUID size is unnecessary. Collisions are
 * unlikely at these lengths but still assume server-side uniqueness for persisted entities.
 * nanoid-based generators are automatically tree-shaken if not used.
 *
 * ## Usage
 *
 * ```ts
 * import { generateId } from "yummies/id";
 * ```
 */

export * from './create-linear-numeric-id-generator.js';
export * from './generate-linear-numeric-id.js';
export * from './generate-stack-based-id.js';
export {
  generateId,
  generateNumericId,
  generateNumericShortId,
  generateShortId,
} from './id-nanoid.js';
