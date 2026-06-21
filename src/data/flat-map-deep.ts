type DeepArray<TValue> = TValue | Array<DeepArray<TValue>>;

/**
 * Recursively flattens a nested array and maps the collected values.
 *
 * @example
 * ```ts
 * flatMapDeep([1, [2, [3]]], (value) => value * 2); // [2, 4, 6]
 * ```
 */
export const flatMapDeep = <TSource, TNewValue>(
  arr: DeepArray<TSource>,
  fn: (value: TSource, i: number, arr: TSource[]) => TNewValue,
): TNewValue[] => {
  const source: TSource[] = [];

  const collect = (value: DeepArray<TSource>): void => {
    if (!Array.isArray(value)) {
      source.push(value);
      return;
    }

    for (const item of value) {
      collect(item);
    }
  };

  collect(arr);

  return source.map((value, i) => fn(value, i, source));
};
