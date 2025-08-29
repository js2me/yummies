import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [, setState] = useState<unknown>(null);

  return useCallback(() => {
    setState({});
  }, []);
};
