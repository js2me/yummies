import { useEffect, useState } from 'react';

export const useVisibilityState = () => {
  const [state, setState] = useState<DocumentVisibilityState>();

  useEffect(() => {
    const handleVisibilityChange = () => {
      setState(document.visibilityState);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
};
