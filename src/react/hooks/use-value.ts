import { useState } from 'react';

export const useValue = <T>(defaults: T | (() => T)) => {
  const [value, setValue] = useState<T>(defaults);

  return {
    value,
    set: setValue,
  };
};
