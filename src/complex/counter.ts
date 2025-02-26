export interface CounterFn<TProcessedValue = number> {
  (): TProcessedValue;
  reset(): void;
}

export const createCounter = <TProcessedValue = number>(
  processValue?: (value: number) => TProcessedValue,
): CounterFn<TProcessedValue> => {
  let counter = 0;

  let incrementFn;

  if (processValue) {
    incrementFn = () => processValue(counter++);
  } else {
    incrementFn = () => counter++ as TProcessedValue;
  }

  (incrementFn as CounterFn<TProcessedValue>).reset = () => {
    counter = 0;
  };

  return incrementFn as CounterFn<TProcessedValue>;
};
