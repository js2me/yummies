import { useState } from 'react';

/**
 * Wraps `useState` and returns the state value as an object with a `set` method.
 *
 * @template T State value type.
 * @param defaults Initial state value or lazy initializer.
 * @returns Object containing the current value and setter.
 *
 * @example
 * ```ts
 * const counter = useValue(0);
 * counter.set(1);
 * ```
 *
 * @example
 * ```ts
 * const user = useValue(() => ({ name: 'Ann' }));
 * user.value.name;
 * ```
 */
export const useValue = <T>(defaults: T | (() => T)) => {
  const [value, setValue] = useState<T>(defaults);

  return {
    value,
    set: setValue,
  };
};
