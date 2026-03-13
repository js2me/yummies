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

/**
 * Creates a callable counter object with increment, decrement and reset helpers.
 *
 * The returned function increments the internal numeric counter when called and
 * exposes both the raw counter value and an optionally transformed `value`.
 *
 * @template TValue Public value type returned by the counter.
 * @param processValue Optional mapper that transforms the numeric counter value.
 * @param initial Initial numeric counter value.
 * @returns Callable counter with state and control methods.
 *
 * @example
 * ```ts
 * const counter = createCounter();
 * counter.increment(); // 1
 * ```
 *
 * @example
 * ```ts
 * const idCounter = createCounter((value) => `id-${value}`, 10);
 * idCounter(); // 'id-11'
 * ```
 */
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
