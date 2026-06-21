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
