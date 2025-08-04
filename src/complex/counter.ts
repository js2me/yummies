/* eslint-disable @typescript-eslint/no-use-before-define */
export interface CounterFn<TProcessedValue = number> {
  (): TProcessedValue;
  counter: number;
  value: TProcessedValue;
  increment(): TProcessedValue;
  decrement(): TProcessedValue;
  reset(): void;
}

export const createCounter = <TProcessedValue = number>(
  processValue?: (value: number) => TProcessedValue,
  initial: number = 0,
): CounterFn<TProcessedValue> => {
  const update = (counter: number) => {
    fn.value = processValue?.(counter) ?? (counter as TProcessedValue);
    return fn.value;
  };

  const increment = () => update(++fn.counter);
  const decrement = () => update(--fn.counter);

  const fn: CounterFn<TProcessedValue> = increment as any;

  fn.increment = increment;
  fn.decrement = decrement;

  fn.reset = () => {
    fn.counter = initial;
    fn.value = processValue?.(initial) ?? (initial as TProcessedValue);
  };

  fn.reset();

  return fn as CounterFn<TProcessedValue>;
};
