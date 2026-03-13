import { useCallback, useState } from 'react';

/**
 * Manages a boolean state and returns helpers to toggle or set it directly.
 *
 * @param initialState Initial boolean value.
 * @returns Tuple with current state, toggle callback and raw setter.
 *
 * @example
 * ```ts
 * const [open, toggleOpen] = useToggle();
 * toggleOpen();
 * ```
 *
 * @example
 * ```ts
 * const [enabled, , setEnabled] = useToggle(true);
 * setEnabled(false);
 * ```
 */
export const useToggle = (initialState?: boolean) => {
  const [toggled, setToggled] = useState(!!initialState);

  const toggle = useCallback(() => setToggled((toggled) => !toggled), []);

  return [toggled, toggle, setToggled] as const;
};
