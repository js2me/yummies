export interface CounterFn<TProcessedValue = number> {
  (): TProcessedValue;
  counter: number;
  value: TProcessedValue;
  reset(): void;
}

export const createCounter = <TProcessedValue = number>(
  processValue?: (value: number) => TProcessedValue,
  initial: number = 0,
): CounterFn<TProcessedValue> => {
  const fn: CounterFn<TProcessedValue> = (() => {
    const nextCounter = ++fn.counter;
    fn.value = processValue?.(nextCounter) ?? (nextCounter as TProcessedValue);
    return fn.value;
  }) as any;

  fn.reset = () => {
    fn.counter = initial;
    fn.value = processValue?.(initial) ?? (initial as TProcessedValue);
  };

  fn.reset();

  return fn as CounterFn<TProcessedValue>;
};
