import { customAlphabet } from 'nanoid';

const DIGITS = '0123456789';
const LATIN_CHARS = 'abcdefghijklmnopqrstuvwxyz';

const ALPHABET = `${LATIN_CHARS}${DIGITS}`;

/**
 * Использует алфавит abcdefghijklmnopqrstuvwxyz0123456789
 * Размер 6
 */
export const generateId = customAlphabet(ALPHABET, 6);

/**
 * Использует алфавит abcdefghijklmnopqrstuvwxyz0123456789
 * Размер 4
 */
export const generateShortId = customAlphabet(ALPHABET, 4);

/**
 * Использует алфавит 0123456789
 * Размер 6
 */
export const generateNumericId = customAlphabet(DIGITS, 6);

/**
 * Использует алфавит 0123456789
 * Размер 4
 */
export const generateNumericShortId = customAlphabet(DIGITS, 4);

/**
 * Создает функцию, которая будет создавать уникальную строку, уникальность которой основана на порядке вызова этой функции
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
 * @param size размер
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
  // eslint-disable-next-line unicorn/error-message
  new Error().stack!.split('\n').slice(1, 4).join('');
