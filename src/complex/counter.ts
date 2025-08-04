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
  const incrementFn: CounterFn<TProcessedValue> = (() => {
    const nextCounter = incrementFn.counter++;
    incrementFn.value =
      processValue?.(nextCounter) ?? (nextCounter as TProcessedValue);
    return incrementFn.value;
  }) as any;

  incrementFn.reset = () => {
    incrementFn.counter = initial;
    incrementFn.value = processValue?.(initial) ?? (initial as TProcessedValue);
  };

  incrementFn.reset();

  return incrementFn as CounterFn<TProcessedValue>;
};
