/**
 * Returns a random floating-point number between `min` and `max`.
 *
 * @example
 * ```ts
 * const value = getRandomFloat(1, 10);
 * ```
 */
export const getRandomFloat = <T extends number = number>(
  min = 0,
  max = 1,
): T => (Math.random() * (max - min) + min) as T;

/**
 * Returns a random integer between `min` and `max`.
 *
 * @example
 * ```ts
 * const value = getRandomInt(1, 10);
 * ```
 */
export const getRandomInt = <T extends number = number>(min = 0, max = 1): T =>
  min === max ? (min as T) : (Math.round(getRandomFloat(min, max)) as T);

/**
 * Picks a random element from the provided array.
 *
 * @example
 * ```ts
 * const fruit = getRandomChoice(['apple', 'banana', 'orange']);
 * ```
 */
export const getRandomChoice = <T>(arr: T[]): T =>
  arr[getRandomInt(0, arr.length - 1)];

/**
 * Creates an array filled with `null` values using a random length.
 *
 * @example
 * ```ts
 * const items = getRandomSizeArray(2, 5);
 * ```
 */
export const getRandomSizeArray = (min = 0, max = 10) =>
  Array.from({ length: getRandomInt(min, max) }).fill(null);

/**
 * Returns a uniformly random boolean.
 *
 * @example
 * ```ts
 * const value = getRandomBool();
 * ```
 */
export const getRandomBool = () => getRandomInt(0, 1) === 1;

/**
 * Returns `true` more often than `false`.
 *
 * @example
 * ```ts
 * const value = getMajorRandomBool();
 * ```
 */
export const getMajorRandomBool = () => {
  return getRandomInt(0, 10) <= 6;
};

/**
 * Returns `true` less often than `false`.
 *
 * @example
 * ```ts
 * const value = getMinorRandomBool();
 * ```
 */
export const getMinorRandomBool = () => {
  return !getMajorRandomBool();
};

/**
 * Returns `true` with the provided probability from `0` to `1`.
 *
 * @example
 * ```ts
 * const shouldRun = getFrequencyValue(0.25);
 * ```
 */
export const getFrequencyValue = (frequency: number) => {
  return Math.random() < frequency;
};
