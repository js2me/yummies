/**
 * Wraps a value in an array when it is not already an array.
 *
 * @example
 * ```ts
 * toArray('item'); // ['item']
 * ```
 */
export const toArray = <TValue>(value: TValue | TValue[]): TValue[] => {
  return Array.isArray(value) ? value : [value];
};
