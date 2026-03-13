/**
 * Creates a promise that resolves after the specified number of milliseconds.
 *
 * @param time Delay in milliseconds.
 * @returns Promise
 */
export const sleep = (time: number = 0, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal) {
      const abortListener = () => {
        clearTimeout(timerId);
        reject(signal?.reason);
      };
      const timerId = setTimeout(() => {
        signal.removeEventListener('abort', abortListener);
        resolve();
      }, time);
      signal.addEventListener('abort', abortListener, { once: true });
    } else {
      setTimeout(resolve, time);
    }
  });

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 *
 * @deprecated Use `sleep` instead.
 * @param ms Delay in milliseconds.
 * @returns Promise
 */
export const waitAsync = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Repeatedly schedules `requestAnimationFrame` until `quitFunction` returns `true`.
 *
 * @param quitFunction Function executed on each animation frame.
 * @param asMicrotask Additionally wraps the RAF scheduling in `queueMicrotask`.
 * @returns void
 */
export const endlessRAF = (
  quitFunction: () => boolean | void,
  asMicrotask?: boolean,
) => {
  if (quitFunction()) return;

  const raf = () =>
    requestAnimationFrame(() => endlessRAF(quitFunction, asMicrotask));

  if (asMicrotask) {
    queueMicrotask(raf);
  } else {
    raf();
  }
};

export function setAbortableTimeout(
  callback: VoidFunction,
  delayInMs?: number,
  signal?: AbortSignal,
) {
  let internalTimer: number | null = null;

  const handleAbort = () => {
    if (internalTimer == null) {
      return;
    }
    clearTimeout(internalTimer);
    internalTimer = null;
  };

  signal?.addEventListener('abort', handleAbort, { once: true });

  internalTimer = setTimeout(() => {
    signal?.removeEventListener('abort', handleAbort);
    callback();
  }, delayInMs);
}

export function setAbortableInterval(
  callback: VoidFunction,
  delayInMs?: number,
  signal?: AbortSignal,
) {
  let timer: number | null = null;

  const handleAbort = () => {
    if (timer == null) {
      return;
    }
    clearInterval(timer);
    timer = null;
  };

  signal?.addEventListener('abort', handleAbort, { once: true });

  timer = setInterval(callback, delayInMs);
}
