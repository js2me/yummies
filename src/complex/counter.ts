export interface Counter<TValue = number> {
  (): TValue;
  counter: number;
  value: TValue;
  increment(): TValue;
  decrement(): TValue;
  reset(): void;
}

/**
 * @deprecated use {`Counter`}. Will be removed in next major release
 */
export interface CounterFn<TValue = number> extends Counter<TValue> {}

export const createCounter = <TValue = number>(
  processValue?: (value: number) => TValue,
  initial: number = 0,
): Counter<TValue> => {
  const update = (counter: number) => {
    fn.value = processValue?.(counter) ?? (counter as TValue);
    return fn.value;
  };

  const increment = () => update(++fn.counter);
  const decrement = () => update(--fn.counter);

  const fn: Counter<TValue> = increment as any;

  fn.increment = increment;
  fn.decrement = decrement;

  fn.reset = () => {
    fn.counter = initial;
    fn.value = processValue?.(initial) ?? (initial as TValue);
  };

  fn.reset();

  return fn as Counter<TValue>;
};
