import { useLayoutEffect } from 'react';
import { useDefineRef } from './use-define-ref.js';

export const useResizeObserver = (callback: ResizeObserverCallback) => {
  const resizeObserverRef = useDefineRef(() => new ResizeObserver(callback));

  useLayoutEffect(() => {
    return () => {
      resizeObserverRef.current.disconnect();
    };
  }, []);

  return resizeObserverRef;
};
