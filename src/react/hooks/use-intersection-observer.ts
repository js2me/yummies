import { useEffect, useState } from 'react';

export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => {
  const [intersectionObserver] = useState(
    () => new IntersectionObserver(callback, options),
  );

  useEffect(() => {
    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  return intersectionObserver;
};
