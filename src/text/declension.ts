/**
 * Returns the correct word form based on the provided count.
 * @example
 * declension(1, ['slovo', 'slova', 'slov']) // 'slovo'
 * @example
 * declension(2, ['slovo', 'slova', 'slov']) // 'slova'
 * @example
 * declension(5, ['slovo', 'slova', 'slov']) // 'slov'
 */
export const declension = (
  count: number,
  txt: readonly [one: string, two: string, five: string],
  cases = [2, 0, 1, 1, 1, 2],
) =>
  txt[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
