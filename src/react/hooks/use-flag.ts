import { useCallback, useRef, useState } from 'react';

export interface FlagHook {
  enabled: boolean;
  toggle: VoidFunction;
  enable: VoidFunction;
  disable: VoidFunction;
}

/**
 * Manages a reusable boolean flag object with stable helper methods.
 *
 * @param defaultValue Initial enabled state.
 * @returns Stable object exposing current state and mutators.
 *
 * @example
 * ```ts
 * const modal = useFlag();
 * modal.enable();
 * ```
 *
 * @example
 * ```ts
 * const loading = useFlag(true);
 * loading.disable();
 * ```
 */
export const useFlag = (defaultValue = false): FlagHook => {
  const [enabled, setEnabled] = useState(defaultValue);

  const toggle = useCallback(() => setEnabled((value) => !value), []);
  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => setEnabled(false), []);

  const flagObjRef = useRef<FlagHook>({
    enabled,
    toggle,
    enable,
    disable,
  });

  flagObjRef.current.enabled = enabled;

  return flagObjRef.current;
};
