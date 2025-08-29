import { useEffect } from 'react';

import { useConstant } from './use-constant.js';

export const useAbortController = () => {
  const controller = useConstant(() => new AbortController());

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return controller;
};
