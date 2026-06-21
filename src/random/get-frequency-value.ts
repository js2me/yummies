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
