import { useEffect, useState } from 'react';

/**
 * Tracks `document.visibilityState` and updates when the page visibility changes.
 *
 * @returns Current document visibility state.
 *
 * @example
 * ```ts
 * const visibility = useVisibilityState();
 * ```
 *
 * @example
 * ```ts
 * const isHidden = useVisibilityState() === 'hidden';
 * ```
 */
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
