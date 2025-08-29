import { useEffect, useRef, useState } from 'react';

export const useInitialHeight = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [initialHeight, setInitialHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (ref.current && !initialHeight) {
      setInitialHeight(ref.current.offsetHeight);
    }
  }, [initialHeight]);

  return { ref, initialHeight };
};
