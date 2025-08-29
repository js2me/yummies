import { useCallback, useRef, useState } from 'react';

export interface FlagHook {
  enabled: boolean;
  toggle: VoidFunction;
  enable: VoidFunction;
  disable: VoidFunction;
}

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
