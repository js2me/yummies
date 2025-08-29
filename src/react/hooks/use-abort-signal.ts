import { useAbortController } from './use-abort-controller.js';

export const useAbortSignal = () => {
  return useAbortController().signal;
};
