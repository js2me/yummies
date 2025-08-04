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

  const fn: CounterFn<TProcessedValue> = (() => fn.increment()) as any;

  fn.increment = () => update(++fn.counter);
  fn.decrement = () => update(--fn.counter);

  fn.reset = () => {
    fn.counter = initial;
    fn.value = processValue?.(initial) ?? (initial as TProcessedValue);
  };

  fn.reset();

  return fn as CounterFn<TProcessedValue>;
};
