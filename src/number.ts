/**
 * Works like `parseFloat(number.toFixed(4))` but performance better
 *
 * @example
 * round(191.212999999999999999999999, 4) // 191.213
 */
export function round(value: number, decimalPlaces: number = 0): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}
