/**
 * @internal Separate chunk so nanoid is tree-shaken away when generateId/generateShortId/etc.
 * are not used. Consumers import from `yummies/id` — this module is not a public entry point.
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
