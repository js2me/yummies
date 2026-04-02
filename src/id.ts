/**
 * ---header-docs-section---
 * # yummies/id
 *
 * ## Description
 *
 * Fast, URL-friendly identifiers based on **nanoid** with curated alphabets and lengths. Use for
 * client-generated keys, trace ids, or UI instance ids where UUID size is unnecessary. Collisions are
 * unlikely at these lengths but still assume server-side uniqueness for persisted entities.
 *
 * ## Usage
 *
 * ```ts
 * import { generateId } from "yummies/id";
 * ```
 */

import { customAlphabet } from 'nanoid';

const DIGITS = '0123456789';
const LATIN_CHARS = 'abcdefghijklmnopqrstuvwxyz';

const ALPHABET = `${LATIN_CHARS}${DIGITS}`;

/**
 * Uses the alphabet `abcdefghijklmnopqrstuvwxyz0123456789`.
 * Length: 6.
 */
export const generateId = customAlphabet(ALPHABET, 6);

/**
 * Uses the alphabet `abcdefghijklmnopqrstuvwxyz0123456789`.
 * Length: 4.
 */
export const generateShortId = customAlphabet(ALPHABET, 4);

/**
 * Uses the alphabet `0123456789`.
 * Length: 6.
 */
export const generateNumericId = customAlphabet(DIGITS, 6);

/**
 * Uses the alphabet `0123456789`.
 * Length: 4.
 */
export const generateNumericShortId = customAlphabet(DIGITS, 4);

/**
 * Creates a function that generates unique strings based on call order.
 *
 * @example
 * ```ts
 * generateLinearNumericId = createLinearNumericIdGenerator(6);
 * generateLinearNumericId() // '000000'
 * generateLinearNumericId() // '000001'
 * ...
 * generateLinearNumericId() // '999999'
 * generateLinearNumericId() // '1000000'
 * ...
 * generateLinearNumericId() // '9999999'
 * generateLinearNumericId() // '10000000'
 * ```
 *
 * @param size Minimum string length.
 * @returns {()=>string}
 */
export const createLinearNumericIdGenerator = (size: number = 9) => {
  let lastCount = 0;
  return () => {
    return (lastCount++).toString().padStart(size, '0');
  };
};

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

/**
 * Is not recommended to use.
 *
 * Generates execution stack based pseudo-id (just sliced string from error stack)
 */
export const generateStackBasedId = () =>
  new Error().stack!.split('\n').slice(1, 4).join('');
