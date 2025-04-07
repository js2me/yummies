/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Создает промис, который будет ждать указанное количество ms, чтобы выполниться
 *
 * @param ms значение в миллисекундах
 * @returns Promise
 */
export const sleep = (time: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * Создает промис, который будет ждать указанное количество ms, чтобы выполниться
 *
 * @deprecated используй {sleep}
 * @param ms значение в миллисекундах
 * @returns Promise
 */
export const waitAsync = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Создает вызов requestAnimationFrame, посылая туда фукнцию {quitFn}, если она возвращает true,
 * тогда повторно не будет создан вызов requestAnimationFrame, иначе будут создаваться повторно
 * вызовы requestAnimationFrame до тем пор, пока эта функция не вернёт true
 *
 * @param quitFn - сама фукнция которая исполнится в requestAnimationFrame
 * @param asMicrotask - дополнительно оборачивает RAF в queueMicrotask
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

  timer = setInterval(() => {
    signal?.removeEventListener('abort', handleAbort);
    callback();
  }, delayInMs);
}
